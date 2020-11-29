const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

// A message service that allows us to create new messages and return all 
// existing messages.
class MessageService {
  constructor() { 
    this.messages = [];
  }

  async find () {
    // Just return all the messages
    return this.messages;
  }

  async create (data) {
    // The new message is the data merged with a unique identifier using 
    // the messages length since it changes whenever we add a message
    const message = {
      id: this.messages.length,
      text: data.text
    }

    // Add the new message to the array of messages
    this.messages.push(message);

    return message;
  }
}

// Creates an ExpressJS compatiable Feathers app
const app = express(feathers());

// Parse HTTP JSON bodies
app.use(express.json());

// Parse URL-encoded parameters
app.use(express.urlencoded({ extended: true }));

// Host static files from the current folder/directory
app.use(express.static(__dirname));

// Add REST API support
app.configure(express.rest());

// Configure Socket.io real-time APIs
app.configure(socketio());

// Register an in-memory message service
app.use('/messages', new MessageService());

// Register a better error handler than the default Express handler
app.use(express.errorHandler());

// Add any new real-time connections to the 'everybody' channel
app.on('connection', connection => app.channel('everbody').join(connection));

// Puyblish all events to the 'everbody' channel
app.publish(data => app.channel('everybody'));

// Start the server
app.listen(3030).on('listening', () => console.log('Feathers server listening on port 3030'));

// Create a sample, default message to populate the initial state of the service
app.service('messages').create({
  text: 'Hell world, from the new server!'
});