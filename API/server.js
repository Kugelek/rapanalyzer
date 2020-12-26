const express = require('express');
const bodyParser = require("body-parser");


const router = require('./controllers/LyricsController.js');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);


const port = 8080;
app.listen(port, () => {
    console.log('Dziala');
});