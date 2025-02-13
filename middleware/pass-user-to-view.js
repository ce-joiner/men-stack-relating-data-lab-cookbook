
// assigns res.locals.user to the session's user, allowing views to conditionally display content based on whether a user is logged in.



const passUserToView = (req, res, next) => {
    res.locals.user = req.session.user ? req.session.user : null;
    next();
  };
  
  module.exports = passUserToView;