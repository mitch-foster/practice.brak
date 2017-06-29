const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session')
const config = require('./config');

const app = express();
const port = config.port || 3000;

// middleware

app.use(bodyParser.json());
app.use(expressSession({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge: 24*60*60*1000, secure: false}
}))

app.use(express.static(__dirname +'./../build'))

app.post('/api/login/:username', (req, res) => {
    req.session.username = req.params.username;
    console.log(`User ${req.session.username} has logged on.`)
    res.status(200).send('Logged In');
})

app.get('/api/me', (req, res)=>{
    res.send(req.session)
})

app.post('/api/cart', (req,res)=>{
    if (!req.session.cart) {
        req.session.cart = []
    }
    req.session.cart.push(req.body)
    res.status(200).send({message:'Cart contains', cart: req.session.cart})
})

app.delete('/api/cart/:product', (req, res)=>{
    if (!req.session.cart){
        res.send('Your cart is empty');
    }
    req.session.cart = req.session.cart.filter(
        e=> e.product !== req.params.product
    )
    res.status(200).send({message:'Cart contains', cart: req.session.cart})
})

app.listen(port, ()=>console.log(`Listening on port ${port}.`))