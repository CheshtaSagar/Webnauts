module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/login');
  },
  forwardAuthenticated: function(req, res,user, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    if(req.user.userType==='developer')
    res.redirect('/developerProfile');
    else
    res.redirect('/companyProfile');     
  }
};
