/**
 * Homepage
 */
exports.index = (req, res) => {
  res.locals.currentPath = '/';
  res.render('pages/home', {
    title: 'Trang chủ',
    fullWidth: true
  });
};

