// const Company = require("../models/Company");
// //const Developer = require("../models/Developer");

// //add this if we want to protect our dashboard or profile
// module.exports = {
  
//     //for company
//     ensureAuthenticated1: function(req, res, next) {
//       {
//       if (req.isAuthenticated()) {
//         console.log('company ansure auth')
//         return next();
//       }
//       console.log('company 14');
//       req.flash('error_msg', 'Please log in to view that company resource');
//       res.redirect('/companies/companyLogin');
//     }
    
// }   
// //     ,
// //     //for company
// //     forwardAuthenticated1: function(req, res, next) {
// //       {
// //         if (!req.isAuthenticated()) {
// //           console.log('company forward authication');
// //         return next();
// //       }
// //       console.log('company54')
// //       res.redirect('/companyProfile');      
// //     }
// //   }

//    };