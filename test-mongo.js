const net = require('net');

const client = new net.Socket();
client.connect(27017, '127.0.0.1', function() {
	console.log('Connected to MongoDB');
	client.destroy();
});

client.on('error', function(err) {
	console.log('Connection failed: ' + err.message);
});
