const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// middleware path to public
// make anything inside public folder accessable without creating routes
app.use(express.static(__dirname + '/public'));

// setup the view engine 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// app.get('/', (req, res) => {
//     res.end('Hey, na');
// });

// app.get('/login', (req, res) => {

// });

app.listen(port, () => console.log('Listening on port: ' + port));


