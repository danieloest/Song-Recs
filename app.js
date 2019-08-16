var request = require('request'); // "Request" library
require('dotenv').config();       // Get environment variables
const express = require('express')
var path = require('path')
const PORT = process.env.PORT || 5000
var bodyParser = require('body-parser');

var client_id = process.env.client_id; // My client id
var client_secret = process.env.client_secret; // My secret


express()
.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.use(bodyParser.json())
.use(bodyParser.urlencoded({extended: true}))
.get('/', (req, res) => res.sendFile(__dirname + "/public/songRecs.html"))
// Get authorization token
.post('/getToken', (req, res) => {
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };
  
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
  
      // use the access token to access the Spotify Web API
      var token = body.access_token;
      var options = {
        url: 'https://api.spotify.com/v1/users/jmperezperez',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function(error, response, body) {
        res.send(token);
      });
    }
  });
})
// Search for songs
.post('/getSong', (req, res) => {
  let url = req.body.url;
  let token = req.body.accessToken;
  var options = {
    url: url,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  };
  request.get(options, function(error, response, body) {
    res.send(body);
  });
})
// Get song recommendations
  .post('/getRecs', (req, res) => {
  let url = req.body.url;
  let song = req.body.song;
  let token = req.body.accessToken;
  var options = {
    url: url,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  };
  request.get(options, function(error, response, body) {
    res.send(body);
  });
})
.listen(PORT, () => console.log(`Listening on ${ PORT }`))

