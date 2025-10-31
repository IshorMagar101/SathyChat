const socket = io();

let currentUsername = '';
let typingTimer;
const TYPING_TIMER_LENGTH = 1000;

const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages-container');
const currentUsernameDisplay = document.getElementById('current-username');
const usersList = document.getElementById('users-list');
const userCount = document.getElementById('user-count');
const typingIndicator = document.getElementById('typing-indicator');
const logoutBtn = document.getElementById('logout-btn');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();

  if (username) {
    currentUsername = username;
    socket.emit('user_join', username);
    showChatScreen();
  }
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();

  if (message) {
    socket.emit('send_message', { message });
    messageInput.value = '';
    socket.emit('typing_stop');
  }
});

messageInput.addEventListener('input', () => {
  socket.emit('typing_start');

  clearTimeout(typingTimer);

  typingTimer = setTimeout(() => {
    socket.emit('typing_stop');
  }, TYPING_TIMER_LENGTH);
});

logoutBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to logout?')) {
    location.reload();
  }
});

socket.on('load_history', (historyMessages) => {
  messagesContainer.innerHTML = '';

  historyMessages.forEach((msg) => {
    displayMessage(msg);
  });

  scrollToBottom();
});

socket.on('receive_message', (data) => {
  displayMessage(data);
  scrollToBottom();
});

socket.on('user_connected', (data) => {
  displaySystemMessage(`${data.username} joined the chat`);
  scrollToBottom();
});

socket.on('user_disconnected', (data) => {
  displaySystemMessage(`${data.username} left the chat`);
  scrollToBottom();
});

socket.on('online_users', (users) => {
  updateUsersList(users);
});

socket.on('user_typing', (data) => {
  typingIndicator.textContent = `${data.username} is typing...`;
  typingIndicator.classList.remove('hidden');
});

socket.on('user_stop_typing', () => {
  typingIndicator.classList.add('hidden');
});

socket.on('join_error', (message) => {
  alert(message);
});

socket.on('message_error', (message) => {
  alert(message);
});

function showChatScreen() {
  loginScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
  currentUsernameDisplay.textContent = currentUsername;
  messageInput.focus();
}

function displayMessage(data) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  const isSent = data.username === currentUsername;
  messageDiv.classList.add(isSent ? 'sent' : 'received');

  const messageHeader = document.createElement('div');
  messageHeader.classList.add('message-header');

  const usernameSpan = document.createElement('span');
  usernameSpan.classList.add('message-username');
  usernameSpan.textContent = data.username;

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('message-time');
  timeSpan.textContent = formatTime(data.timestamp);

  messageHeader.appendChild(usernameSpan);
  messageHeader.appendChild(timeSpan);

  const messageBubble = document.createElement('div');
  messageBubble.classList.add('message-bubble');
  messageBubble.textContent = data.message;

  messageDiv.appendChild(messageHeader);
  messageDiv.appendChild(messageBubble);

  messagesContainer.appendChild(messageDiv);
}

function displaySystemMessage(text) {
  const systemDiv = document.createElement('div');
  systemDiv.classList.add('system-message');
  systemDiv.textContent = text;
  messagesContainer.appendChild(systemDiv);
}

function updateUsersList(users) {
  usersList.innerHTML = '';
  userCount.textContent = users.length;

  users.forEach((username) => {
    const li = document.createElement('li');
    li.textContent = username;
    usersList.appendChild(li);
  });
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
