const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.BASE_URL || 'http://localhost:3000'}/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Lazy load User model to avoid circular dependency
      const { User } = require('../models');
      
      // Find user by Google ID or email
      let user = await User.findOne({
        where: {
          google_id: profile.id
        }
      });

      if (!user) {
        // Try to find by email
        user = await User.findByEmail(profile.emails[0].value);
        
        if (user) {
          // Link Google account to existing user
          user.google_id = profile.id;
          user.avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : user.avatar;
          if (!user.email_verified) {
            user.email_verified = true;
            user.email_verified_at = new Date();
          }
          await user.save();
        } else {
          // Create new user from Google profile
          const nameParts = profile.displayName.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || firstName;
          
          user = await User.create({
            first_name: firstName,
            last_name: lastName,
            email: profile.emails[0].value,
            password: null, // OAuth users don't need password
            google_id: profile.id,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            email_verified: true,
            email_verified_at: new Date(),
            is_active: true,
            role: 'student'
          });
        }
      } else {
        // Update avatar if changed
        if (profile.photos && profile.photos[0] && profile.photos[0].value !== user.avatar) {
          user.avatar = profile.photos[0].value;
          await user.save();
        }
      }

      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));
} else {
  console.warn('⚠️  Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    // Lazy load User model to avoid circular dependency
    const { User } = require('../models');
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
