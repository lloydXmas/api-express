require('dotenv').config()
const express = require('express');
const nunjucks = require('nunjucks');
const body_parser = require('body-parser');
const axios = require('axios');
const rp = require('request-promise');

var app = express();

app.use(body_parser.urlencoded({
	extended: false
}));
app.use(express.static('public'));

nunjucks.configure('views', {
	autoescape: true,
	express: app,
	noCache: true
});

app.get('/', function(req, res) {
	res.render('index.html');
});

app.post('/api', function(req, res) {
	var search_type = req.body.search;
	var query_string = req.body.qstring;
	console.log('API Query:', search_type, query_string);

	switch (search_type) {
		case 'movie':
			var api_url = 'https://api.themoviedb.org/3/search/movie';
			break;
		case 'tv':
			var api_url = 'https://api.themoviedb.org/3/search/tv';
			break;
	}

	var config = {
		params: {
			api_key: process.env.API_KEY,
			query: query_string
		}
	};
	axios.get(api_url, config)
		.then(function(response) {
			res.send(response.data);

		})
		.catch(function(error) {
			console.error(error);
		});
});

app.listen(8080, function() {
	console.log('Listening on port 8080');
});
