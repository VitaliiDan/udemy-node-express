const {Router, request} = require('express')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {

        res.redirect('/auth/login#login')
    })

})

router.post('/login', async (req, res) => {
    const user = await User.findById('611bacc98c49da1aac00130d')
    req.session.user = user
    req.session.isAuthenticated = true
    req.session.save(err => {
        if (err) {
            throw err
        }
        res.redirect('/')
    })
})

module.exports = router;
