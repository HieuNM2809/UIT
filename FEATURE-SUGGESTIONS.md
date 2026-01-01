# Đề Xuất Tính Năng Mới - StudyMate AI

Tài liệu này tổng hợp các đề xuất tính năng mới cho StudyMate AI dựa trên phân tích mã nguồn hiện tại và mục tiêu dự án (lấy cảm hứng từ Duolingo).

## 📊 Tổng Quan

Dự án hiện tại đã có:
- ✅ Hệ thống xác thực và quản lý người dùng
- ✅ Quản lý khóa học và nội dung
- ✅ Hệ thống đăng ký (enrollment)
- ✅ Theo dõi tiến độ cơ bản
- ✅ AI Chat Assistant
- ✅ Blog và bình luận
- ✅ Quiz system (models)
- ✅ Notification system
- ✅ Activity logging

**Thiếu/Cần hoàn thiện:**
- ❌ Hệ thống Streak (đã có UI nhưng chưa implement)
- ❌ Hệ thống XP/Points
- ❌ Leaderboards
- ❌ Daily Goals
- ❌ Spaced Repetition
- ❌ Adaptive Difficulty
- ❌ Practice Mode
- ❌ Social Features (Friends, Clubs)
- ❌ Skill Trees / Crown Levels
- ❌ Checkpoints
- ❌ Legendary Status

---

## 🎮 1. GAMIFICATION & ENGAGEMENT

### 1.1. Hệ Thống Streak (Chuỗi Học Tập)
**Mức độ ưu tiên: CAO** ⭐⭐⭐

**Mô tả:**
- Theo dõi số ngày học liên tiếp của người dùng
- Hiển thị streak trên dashboard (hiện đang hardcode = 0)
- Thưởng XP bonus khi duy trì streak
- Streak freeze (bảo vệ streak khi nghỉ 1 ngày)

**Cần implement:**
```javascript
// Model: UserStreak
- user_id
- current_streak (INTEGER)
- longest_streak (INTEGER)
- last_study_date (DATE)
- streak_freeze_count (INTEGER)
- streak_freeze_used (BOOLEAN)
```

**Features:**
- Tự động cập nhật streak khi hoàn thành bài học
- Thông báo khi streak sắp mất
- Achievement cho các milestone (7, 30, 100 ngày)
- Streak freeze item (có thể mua bằng XP hoặc đạt được)

---

### 1.2. Hệ Thống XP (Experience Points)
**Mức độ ưu tiên: CAO** ⭐⭐⭐

**Mô tả:**
- Trao XP khi hoàn thành các hoạt động học tập
- Hiển thị level dựa trên tổng XP
- XP leaderboard

**Cần implement:**
```javascript
// Thêm vào User model:
- total_xp (INTEGER, default: 0)
- current_level (INTEGER, default: 1)
- xp_to_next_level (INTEGER)

// Model: XPTransaction
- user_id
- amount (INTEGER)
- source (ENUM: 'lesson_complete', 'quiz_pass', 'streak_bonus', 'achievement', etc.)
- related_id (UUID)
- related_type (STRING)
```

**XP Rewards:**
- Hoàn thành bài học: 10-50 XP (tùy độ khó)
- Hoàn thành quiz: 20-100 XP (tùy điểm số)
- Duy trì streak: 5 XP/ngày bonus
- Đạt achievement: 50-500 XP
- Hoàn thành khóa học: 200-1000 XP

**Level System:**
- Level 1-10: Beginner (0-1000 XP)
- Level 11-25: Intermediate (1000-5000 XP)
- Level 26-50: Advanced (5000-20000 XP)
- Level 51+: Expert (20000+ XP)

---

### 1.3. Leaderboards (Bảng Xếp Hạng)
**Mức độ ưu tiên: TRUNG BÌNH** ⭐⭐

**Mô tả:**
- Bảng xếp hạng theo XP (tuần/tháng/tất cả thời gian)
- Bảng xếp hạng theo streak
- Bảng xếp hạng theo số khóa học hoàn thành
- Privacy controls (ẩn/hiện trên leaderboard)

**Cần implement:**
```javascript
// Thêm vào User model:
- leaderboard_visible (BOOLEAN, default: true)
- leaderboard_rank (INTEGER) // cached rank

// Controller: leaderboardController.js
- getXPLeaderboard(period)
- getStreakLeaderboard(period)
- getCourseCompletionLeaderboard(period)
```

**Features:**
- Real-time ranking updates
- Weekly/monthly resets
- Badges cho top 10, top 3
- Filter theo khoa/lớp (nếu có)

---

### 1.4. Daily Goals (Mục Tiêu Hàng Ngày)
**Mức độ ưu tiên: CAO** ⭐⭐⭐

**Mô tả:**
- Người dùng đặt mục tiêu học tập hàng ngày (XP, thời gian, số bài học)
- Thông báo nhắc nhở khi chưa đạt mục tiêu
- Thưởng bonus khi đạt mục tiêu

**Cần implement:**
```javascript
// Model: DailyGoal
- user_id
- goal_type (ENUM: 'xp', 'time', 'lessons', 'custom')
- target_value (INTEGER)
- current_value (INTEGER, default: 0)
- date (DATE)
- completed (BOOLEAN, default: false)
- completed_at (DATE)
```

**Features:**
- Đặt mục tiêu mặc định hoặc tùy chỉnh
- Progress bar hiển thị tiến độ
- Notification nhắc nhở (18h, 20h, 22h)
- Weekly summary email
- Achievement cho việc đạt mục tiêu liên tiếp

---

### 1.5. Crown Levels & Skill Trees
**Mức độ ưu tiên: TRUNG BÌNH** ⭐⭐

**Mô tả:**
- Mỗi khóa học/course section có nhiều cấp độ (1-5 crowns)
- Skill tree visualization cho toàn bộ khóa học
- Phải đạt crown level nhất định để unlock nội dung tiếp theo

**Cần implement:**
```javascript
// Model: CourseSkill
- course_id
- skill_name (STRING)
- skill_order (INTEGER)
- parent_skill_id (UUID, nullable)
- crown_levels (JSONB) // {level_1: requirements, level_2: ...}

// Model: UserSkillProgress
- user_id
- skill_id
- current_crown_level (INTEGER, 0-5)
- xp_earned (INTEGER)
- last_practiced (DATE)
```

**Features:**
- Visual skill tree với progress indicators
- Unlock system dựa trên crown levels
- Practice mode để tăng crown level
- Legendary status (crown level 5 + perfect score)

---

## 🧠 2. LEARNING EXPERIENCE

### 2.1. Spaced Repetition (Lặp Lại Ngắt Quãng)
**Mức độ ưu tiên: CAO** ⭐⭐⭐

**Mô tả:**
- Tự động đề xuất ôn tập nội dung đã học theo thuật toán spaced repetition
- Dựa trên độ khó và thời gian từ lần học cuối

**Cần implement:**
```javascript
// Thêm vào Progress model:
- last_reviewed (DATE)
- review_count (INTEGER, default: 0)
- ease_factor (DECIMAL, default: 2.5) // SM-2 algorithm
- interval_days (INTEGER, default: 1)
- next_review_date (DATE)

// Service: spacedRepetitionService.js
- calculateNextReview(progress)
- getItemsDueForReview(userId)
- updateEaseFactor(progress, performance)
```

**Algorithm:**
- Sử dụng SM-2 (SuperMemo 2) hoặc Anki algorithm
- Điều chỉnh interval dựa trên performance
- Priority queue cho items cần review

---

### 2.2. Adaptive Difficulty (Độ Khó Thích Ứng)
**Mức độ ưu tiên: TRUNG BÌNH** ⭐⭐

**Mô tả:**
- Tự động điều chỉnh độ khó nội dung dựa trên performance
- Đề xuất bài tập phù hợp với level hiện tại

**Cần implement:**
```javascript
// Thêm vào Content model:
- difficulty_level (ENUM: 'easy', 'medium', 'hard', 'expert')
- adaptive_difficulty (BOOLEAN, default: false)

// Model: UserDifficultyProfile
- user_id
- course_id
- current_difficulty (DECIMAL, 0-1)
- performance_history (JSONB)
- recommended_difficulty (DECIMAL)

// Service: adaptiveDifficultyService.js
- calculateDifficulty(userId, courseId)
- recommendContent(userId, courseId)
- adjustDifficulty(userId, performance)
```

**Features:**
- AI-powered difficulty adjustment
- Personalized learning path
- Challenge mode (tăng độ khó)
- Comfort zone detection

---

### 2.3. Practice Mode (Chế Độ Luyện Tập)
**Mức độ ưu tiên: CAO** ⭐⭐⭐

**Mô tả:**
- Cho phép người dùng luyện tập lại nội dung đã học
- Focus vào các điểm yếu được AI xác định
- Không ảnh hưởng đến progress chính

**Cần implement:**
```javascript
// Model: PracticeSession
- user_id
- course_id
- content_ids (ARRAY[UUID])
- focus_areas (JSONB) // weak points
- started_at (DATE)
- completed_at (DATE)
- score (DECIMAL)
- practice_type (ENUM: 'review', 'weak_areas', 'random')

// Controller: practiceController.js
- startPracticeSession()
- getWeakAreas()
- completePracticeSession()
```

**Features:**
- AI-identified weak areas
- Random practice mode
- Timed practice sessions
- Progress tracking riêng cho practice

---

### 2.4. Checkpoints (Điểm Kiểm Tra)
**Mức độ ưu tiên: TRUNG BÌNH** ⭐⭐

**Mô tả:**
- Định kỳ đánh giá để unlock nội dung mới
- Đảm bảo người dùng nắm vững trước khi tiếp tục

**Cần implement:**
```javascript
// Model: Checkpoint
- course_id
- checkpoint_order (INTEGER)
- required_score (DECIMAL, default: 70)
- quiz_id (UUID) // quiz để pass checkpoint
- unlocks_content_ids (ARRAY[UUID])

// Model: UserCheckpoint
- user_id
- checkpoint_id
- passed (BOOLEAN)
- attempts (INTEGER)
- best_score (DECIMAL)
- passed_at (DATE)
```

**Features:**
- Visual checkpoint markers trong course
- Retry với cooldown
- Progress gating (không thể skip)
- Checkpoint summary report

---

### 2.5. Legendary Status (Trạng Thái Huyền Thoại)
**Mức độ ưu tiên: THẤP** ⭐

**Mô tả:**
- Đạt được khi hoàn thành khóa học với điểm số hoàn hảo
- Special badge và recognition
- Unlock exclusive content

**Cần implement:**
```javascript
// Thêm vào Enrollment model:
- legendary_status (BOOLEAN, default: false)
- legendary_achieved_at (DATE)

// Logic:
- Tất cả quizzes >= 95%
- Tất cả assignments hoàn thành
- Tổng điểm >= 95%
- Không có retry nào
```

**Features:**
- Special badge display
- Leaderboard highlight
- Exclusive content access
- Achievement unlock

---

## 👥 3. SOCIAL FEATURES

### 3.1. Friends System (Hệ Thống Bạn Bè)
**Mức độ ưu tiên: TRUNG BÌNH** ⭐⭐

**Mô tả:**
- Kết nối với bạn bè trong UIT
- Xem progress của bạn (với permission)
- Friendly competition

**Cần implement:**
```javascript
// Model: Friendship
- user_id (requester)
- friend_id (accepted)
- status (ENUM: 'pending', 'accepted', 'blocked')
- created_at (DATE)
- accepted_at (DATE)

// Model: FriendActivity (optional, for feed)
- user_id
- activity_type
- activity_data (JSONB)
- visibility (ENUM: 'friends', 'public', 'private')
```

**Features:**
- Friend request system
- Privacy controls
- Friend activity feed
- Compare progress (opt-in)
- Study together reminders

---

### 3.2. Study Clubs (Câu Lạc Bộ Học Tập)
**Mức độ ưu tiên: TRUNG BÌNH** ⭐⭐

**Mô tả:**
- Tạo/join study groups trong UIT
- Club leaderboards
- Group challenges

**Cần implement:**
```javascript
// Model: StudyClub
- name (STRING)
- description (TEXT)
- course_id (UUID, nullable) // club for specific course
- max_members (INTEGER, default: 50)
- is_public (BOOLEAN, default: true)
- created_by (UUID)

// Model: ClubMembership
- club_id
- user_id
- role (ENUM: 'admin', 'member')
- joined_at (DATE)
- total_xp_contributed (INTEGER)
```

**Features:**
- Create/join/leave clubs
- Club leaderboard
- Group goals
- Club chat/discussion
- Weekly club challenges

---

### 3.3. Achievement Sharing
**Mức độ ưu tiên: THẤP** ⭐

**Mô tả:**
- Chia sẻ achievements lên social media
- Share progress milestones
- Privacy controls

**Cần implement:**
```javascript
// Service: sharingService.js
- generateAchievementImage(achievement)
- shareToSocial(platform, content)
- generateProgressReport(userId, period)
```

**Features:**
- Auto-generated share images
- Social media integration
- Progress report sharing
- Privacy settings

---

## 🤖 4. AI ENHANCEMENTS

### 4.1. AI-Powered Question Generation
**Mức độ ưu tiên: CAO** ⭐⭐⭐

**Mô tả:**
- AI tạo câu hỏi practice dựa trên nội dung đã học
- Personalized quiz generation
- Focus vào weak areas

**Cần implement:**
```javascript
// Service: aiQuestionService.js
- generateQuestions(content, difficulty, count)
- generatePracticeQuestions(userId, courseId)
- generateWeakAreaQuestions(userId)
```

**Features:**
- Multiple question types
- Difficulty adaptation
- Context-aware questions
- Explanation generation

---

### 4.2. AI Learning Path Optimization
**Mức độ ưu tiên: TRUNG BÌNH** ⭐⭐

**Mô tả:**
- AI đề xuất thứ tự học tối ưu
- Personalized learning sequence
- Adaptive path based on performance

**Cần implement:**
```javascript
// Service: aiLearningPathService.js
- generateOptimalPath(userId, courseId)
- adjustPath(userId, performance)
- recommendNextContent(userId)
```

**Features:**
- Dynamic path adjustment
- Prerequisite checking
- Performance-based routing
- Alternative paths

---

### 4.3. AI Study Buddy (Trợ Lý Học Tập AI)
**Mức độ ưu tiên: TRUNG BÌNH** ⭐⭐

**Mô tả:**
- AI assistant chủ động nhắc nhở học tập
- Personalized study tips
- Motivation messages

**Cần implement:**
```javascript
// Service: aiStudyBuddyService.js
- sendDailyReminder(userId)
- provideStudyTips(userId, context)
- motivateUser(userId, performance)
- suggestBreakTime(userId)
```

**Features:**
- Proactive notifications
- Context-aware tips
- Encouragement messages
- Break reminders

---

## 📱 5. MOBILE & OFFLINE

### 5.1. Offline Mode (Chế Độ Offline)
**Mô tả:**
- Tải nội dung để học offline
- Sync progress khi online
- Service worker cho PWA

**Cần implement:**
```javascript
// Service: offlineService.js
- downloadContentForOffline(userId, contentIds)
- syncOfflineProgress(userId)
- checkOfflineAvailability(contentId)

// Frontend:
- Service Worker
- IndexedDB for caching
- Background sync API
```

---

### 5.2. Mobile App (React Native)
**Mô tả:**
- Native mobile app
- Push notifications
- Better offline support

---

## 📊 6. ANALYTICS & INSIGHTS

### 6.1. Learning Analytics Dashboard
**Mô tả:**
- Detailed analytics về learning patterns
- Time spent analysis
- Performance trends
- Weak areas visualization

**Cần implement:**
```javascript
// Controller: analyticsController.js
- getLearningAnalytics(userId, period)
- getPerformanceTrends(userId)
- getWeakAreasAnalysis(userId)
- getTimeDistribution(userId)
```

---

### 6.2. Weekly/Monthly Reports
**Mô tả:**
- Email reports về progress
- Achievements summary
- Recommendations

**Cần implement:**
```javascript
// Service: reportService.js
- generateWeeklyReport(userId)
- generateMonthlyReport(userId)
- sendReportEmail(userId, report)
```

---

## 🎯 7. QUICK WINS (Dễ Implement)

### 7.1. Notification Enhancements
- ✅ Notification system đã có
- Cần: Implement notification triggers cho achievements, streaks, goals

### 7.2. Badge System
- ✅ Achievement model đã có
- Cần: Badge display, unlock logic, notification

### 7.3. Progress Visualization
- ✅ Progress tracking đã có
- Cần: Better charts, skill trees, progress heatmap

### 7.4. Quiz Enhancements
- ✅ Quiz models đã có
- Cần: Quiz taking interface, timer, instant feedback

---

## 📋 IMPLEMENTATION PRIORITY

### Phase 1 (High Priority - 2-3 weeks)
1. ✅ Streak System
2. ✅ XP System
3. ✅ Daily Goals
4. ✅ Practice Mode
5. ✅ Achievement Unlock Logic

### Phase 2 (Medium Priority - 1-2 months)
1. ✅ Spaced Repetition
2. ✅ Leaderboards
3. ✅ Checkpoints
4. ✅ AI Question Generation
5. ✅ Friends System

### Phase 3 (Nice to Have - 2-3 months)
1. ✅ Adaptive Difficulty
2. ✅ Crown Levels
3. ✅ Study Clubs
4. ✅ Offline Mode
5. ✅ Learning Analytics

---

## 🔧 TECHNICAL CONSIDERATIONS

### Database Migrations
- Cần tạo migrations cho tất cả models mới
- Indexes cho performance
- Foreign key constraints

### Performance
- Cache leaderboards (Redis)
- Background jobs cho streak updates
- Optimize queries với eager loading

### Security
- Privacy controls cho social features
- Rate limiting cho AI endpoints
- Input validation

### Testing
- Unit tests cho gamification logic
- Integration tests cho streaks/XP
- E2E tests cho user flows

---

## 📝 NOTES

- Tất cả features nên có Vietnamese language support
- Mobile-first design
- Accessibility (WCAG 2.1 AA)
- Follow MVC pattern đã định nghĩa
- Use existing models/services khi có thể
- Implement theo từng phase, test kỹ trước khi chuyển phase tiếp theo

---

**Tài liệu này sẽ được cập nhật khi có thêm requirements hoặc feedback từ team.**

