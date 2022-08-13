module.exports = (req, res, next) =>
{
    if (req.session.role == 'Admin')
    {
        next();
    }
    else
    {
        res.redirect('/')
    }
}