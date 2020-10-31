
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

exports.isUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error_msg', 'Please log in.');
        res.redirect('/login');
    }
}