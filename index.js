const express = require('express');
const path = require('path')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const courseRoutes = require('./routes/courses')
const aboutRoutes = require('./routes/about')
const User = require('./models/user')

const app = express();

const handlebars = expressHandlebars.create({
    defaultLayout: 'main',
    extname: 'handlebars'
})

app.engine('handlebars', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', 'handlebars')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('611bacc98c49da1aac00130d')
        req.user = user
        next()
    } catch (e) {
        console.log(e);
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', courseRoutes)
app.use('/about', aboutRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        const urlDB = `mongodb+srv://vdan:4LekvTazOY491kUR@cluster0.xih8i.mongodb.net/shop`
        await mongoose.connect(urlDB, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        const candidate = await User.findOne();
        if (!candidate) {
            const user = new User({
                email: 'if.dir.dv@gmail.com',
                name: 'vdan',
                cart: {items: []},
            })
            await user.save()
        }
        app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
    } catch (err) {
        console.log(err);
    }
}

start()


