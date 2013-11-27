/* global require, exports */

var fs = require('fs'),
		io = require('socket.io').listen(80),
		projects = [];

if (fs.existsSync('projects.json')) {
	projects = JSON.parse(fs.readFileSync('projects.json', 'utf-8'));
}

io.sockets.on('connection', function (socket) {
	socket.emit('load', { projects: projects });

	socket.on('save', function (data) {
		data = JSON.parse(data || "{}");
		if (data.projects && data.projects.length > 0) {
			projects = data.projects;
			socket.broadcast.emit('load', data);
		}
	});
});
