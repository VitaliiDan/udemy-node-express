const express = require('express');
const path = require('path')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const courseRoutes = require('./routes/courses')
const aboutRoutes = require('./routes/about')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const app = express();

const handlebars = expressHandlebars.create({
    defaultLayout: 'main',
    extname: 'handlebars'
})

const MONGODB_URI = `mongodb+srv://vdan:4LekvTazOY491kUR@cluster0.xih8i.mongodb.net/shop`

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI,

})

app.engine('handlebars', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', 'handlebars')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', courseRoutes)
app.use('/about', aboutRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        // const candidate = await User.findOne();
        // if (!candidate) {
        //     const user = new User({
        //         email: 'if.dir.dv@gmail.com',
        //         name: 'vdan',
        //         cart: {items: []},
        //     })
        //     await user.save()
        // }
        app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
    } catch (err) {
        console.log(err);
    }
}

start()


