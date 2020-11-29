const feathers = require('@feathersjs/feathers');
const app = feathers();


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

// Register the message service on the Feathers application
app.use('messages', new MessageService());

// Log every time a new message is created
app.service('messages').on('created', message => { 
  console.log('A new message has been created', message);
});

// A function that creates new messages and then logs all existing messages
const main = async () => {
  // Create a new message on our message service
  await app.service('messages').create({
    text: 'Hello Feathers'
  });

  await app.service('messages').create({
    text: 'Hello again'
  });

  // Find all existing messages
  const messages = await app.service('messages').find();

  console.log('All messages', messages);
};

main();