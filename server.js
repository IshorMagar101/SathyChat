const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

app.use(express.static('public'));

let onlineUsers = new Map();

function loadMessages() {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
  return [];
}

function saveMessages(messages) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

let messages = loadMessages();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_join', (username) => {
    const sanitizedUsername = username.trim().substring(0, 30);

    if (!sanitizedUsername) {
      socket.emit('join_error', 'Username cannot be empty');
      return;
    }

    onlineUsers.set(socket.id, sanitizedUsername);

    socket.emit('load_history', messages);

    socket.broadcast.emit('user_connected', {
      username: sanitizedUsername,
      timestamp: new Date().toISOString()
    });

    io.emit('online_users', Array.from(onlineUsers.values()));

    console.log(`${sanitizedUsername} joined the chat`);
  });

  socket.on('send_message', (data) => {
    const username = onlineUsers.get(socket.id);

    if (!username) {
      socket.emit('message_error', 'You must join with a username first');
      return;
    }

    const sanitizedMessage = data.message.trim().substring(0, 500);

    if (!sanitizedMessage) {
      return;
    }

    const messageData = {
      id: Date.now() + Math.random(),
      username: username,
      message: sanitizedMessage,
      timestamp: new Date().toISOString()
    };

    messages.push(messageData);

    if (messages.length > 200) {
      messages = messages.slice(-200);
    }

    saveMessages(messages);

    io.emit('receive_message', messageData);
  });

  socket.on('typing_start', () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      socket.broadcast.emit('user_typing', { username });
    }
  });

  socket.on('typing_stop', () => {
    const username = onlineUsers.get(socket.id);
    if (username) {
      socket.broadcast.emit('user_stop_typing', { username });
    }
  });

  socket.on('disconnect', () => {
    const username = onlineUsers.get(socket.id);

    if (username) {
      onlineUsers.delete(socket.id);

      socket.broadcast.emit('user_disconnected', {
        username: username,
        timestamp: new Date().toISOString()
      });

      io.emit('online_users', Array.from(onlineUsers.values()));

      console.log(`${username} left the chat`);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
  console.log(`📱 Access your app: http://localhost:${PORT}`);
});