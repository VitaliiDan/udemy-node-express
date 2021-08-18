const {Router} = require('express');
const router = Router ()

router.get("/", (req, res) => {
    res.render('about', {
        title: 'about us',
        isAbout: true
    })
})

module.exports = router;
