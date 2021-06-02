const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/powerplants.html");
});

// handling 404 requests
app.get('*', function(req, res) {
	res.send('404! Page not found.');
});

// log this in console when ran
app.listen(PORT, () => {
	console.log(`Listening to localhost on port ${PORT}`);
});
