var express = require('express'),
   app = express(),
   path = require('path'),
   formidable = require('formidable'),
   fs = require('fs'),
   crypto = require('crypto');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', function(req, res) {
	var form = new formidable.IncomingForm();
	form.multiples = true;
	form.uploadDir = path.join(__dirname, '/uploads');
	form.on('file', function(field, file) {
		fs.readFile(file.path, function(err,data) {
			console.log("New file! SHA-1: " + crypto.createHash('sha1').update(data).digest('hex'));
		})
		fs.rename(file.path, path.join(form.uploadDir, file.name));
	});
	form.on('error', function(err) {
		console.log('An error has occured: \n' + err);
	});
	form.on('end', function() {
		res.end('success');
	});
	form.parse(req);
});

var server = app.listen(3000, function() {
	console.log('Server started on port 3000');
});