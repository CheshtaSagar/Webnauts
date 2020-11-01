//authentication for Developer
exports.isDeveloper = function(req, res, next) {
    if (req.isAuthenticated()&& res.locals.user.userType == 'developer') {
        next();
    } else {
        req.flash('error_msg', 'Please log in as developer to view that resource.');
        res.redirect('/login');
    }
}

//authentication for Company
exports.isCompany = function(req, res, next) {
    if (req.isAuthenticated() && res.locals.user.userType == 'company') {
        next();
    } else {
        req.flash('error_msg', 'Please log in as company to view that resource.');
        res.redirect('/login');
    }
}

//authentication for both Developer and Company
exports.isUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error_msg', 'Please log in.');
        res.redirect('/login');
    }
}