
// check if first login then redirect user to first-login page
module.exports = (req, res, next) =>
{
    if (req.session.first)
    {
        res.render('first-login', { title: 'First Login', login: req.session.login, name: req.session.name, id: req.session.id,address:'home' });
    }
    else
    {
        next();
    }
}