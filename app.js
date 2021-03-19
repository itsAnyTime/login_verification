const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require("./models/db");

// middleware path to public
// make anything inside public folder accessable without creating routes
app.use(express.static(__dirname + '/public'));
// add express middleware to let the app to be able to posted data as json or using get or form
// This two lines make it work to show user input in console
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// setup the view engine 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    // res.end('Hey, na'); // test success
    res.render('index')
});

app.get('/login', (req, res) => {
    res.render('login')
});

// responses map
// 1. registration is down
// 2. unknown error
// 3. user email already exist 

// create a route to get register data
app.post('/signup', (req, res) => {
    // serverside too
    console.log(req.body);

    const { name, email, password } = req.body;
    db.addUser(name, email, password).then(() => {
        res.json(1);  // all is good
    }).catch(error => {
        console.log(error);
        if(error === 3) {
            res.json(3);  // error
        } else {
            res.json(2);
        }
    })
})
    
app.listen(port, () => console.log('Listening on port: ' + port));

// to do next week
// save posted signup data to database
// send a confirmation email to the user, show that sign success