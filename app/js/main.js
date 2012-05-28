$(document).ready(init);
var socket, host, port, $events;

function init() {
  host = 'http://localhost:2012';
  socket = io.connect(host);

  socket.on('connection', onServerConnected);
  socket.on('disconnect', onServerDisconnected);
  socket.on('all', onEvent);

  $events = $('#events');
}

function onServerConnected(e) {
  log('Connected to server', 'info');
}

function onServerDisconnected(e) {
  log('Disconnected from server', 'info');
}

function onEvent(e) {
  log('New event ' + e.eventName + ' on ' + e.channel, 'status');

  var note = webkitNotifications.createNotification('/img/icon128-min.png', 'New Event', e.data.toString());
  note.show();
}

function log(str, type) {
  $events.append('<li class="'+type+'">' + str + '</li>');
}
