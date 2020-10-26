// module.exports.isCompany: function(req, res, next) {
//     if (req.isAuthenticated() && re) {
//       return next();
//     }
//     req.flash('error_msg', 'Please log in to view that resource');
//     res.redirect('/login');
//   },
//   forwardAuthenticated: function(req, res,user, next) {
//     if (!req.isAuthenticated()) {
//       return next();
//     }
//     if(req.user.userType==='developer')
//     res.redirect('/developerProfile');
//     else
//     res.redirect('/companyProfile');     
//   }


exports.isDeveloper = function(req, res, next) {
    if (req.isAuthenticated()&& res.locals.user.userType == 'developer') {
        next();
    } else {
        req.flash('error_msg', 'Please log in as developer to view that resource.');
        res.redirect('/login');
    }
}

exports.isCompany = function(req, res, next) {
    if (req.isAuthenticated() && res.locals.user.userType == 'company') {
        next();
    } else {
        req.flash('error_msg', 'Please log in as company to view that resource.');
        res.redirect('/login');
    }
}