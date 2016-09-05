var express = require('express'),
   app = express(),
   path = require('path'),
   formidable = require('formidable'),
   fs = require('fs'),
   crypto = require('crypto'),
   shortid = require('shortid').generate;

var idStore = require('./models');

process.addListener('uncaughtException', function (err, stack) {
  console.log('Caught exception: ' + err + '\n' + err.stack);
  console.log('\u0007'); // Terminal bell
});

idStore.on('connect', function() {
  console.log('connected to redis');
});

var createId = function(length) {
  var len = length || 3;
  return shortid().substr(-len, len);
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:uploadId', function(req, res) {
  res.send(req.params.uploadId);
});

app.post('/upload', function(req, res) {
	var form = new formidable.IncomingForm();
	form.multiples = true;
	form.uploadDir = path.join(__dirname, '/uploads');
	form.on('file', function(field, file) { 
		fs.readFile(file.path, function(err, data) {
      //var hash = crypto.createHash('sha1').update(data).digest('hex').toString();
      var tmpName = path.basename(file.path).substr(7);
      console.log(tmpName);
      var fileID = createId().toString();
			console.log("New file! ID: " + fileID );
      fs.rename(file.path,  form.uploadDir + '/' + fileID);
      var hashFields = {
        "name": file.name
      }
      idStore.hmset(fileID, hashFields, function(err, reply) {
        console.log(file.name, reply);
      });    
		});
    // fs.rename(file.path, fileName);   	
	});
	form.on('error', function(err) {
		console.log('An error has occured: \n' + err);
	});
	form.on('end', function() {
		res.end('success');
	});
	form.parse(req);
});

app.listen(3000, function() {
	console.log('Server started on port 3000');
});