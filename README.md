# Real-Time Chat Application

A production-ready, full-stack real-time chat application built for college project demonstration. Features include user authentication, real-time messaging, typing indicators, online user tracking, and message persistence.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Real-time Communication**: Socket.IO
- **Data Persistence**: JSON file storage

## Features

### Core Functionality
- User authentication with username entry
- Real-time message broadcasting to all connected users
- Dynamic online users list with live updates
- Message persistence (chat history loads on join)
- "User is typing..." indicators
- Join/leave notifications
- Timestamps on all messages
- Responsive, modern UI with chat bubbles

### Technical Features
- Input validation and sanitization
- Auto-scroll to newest messages
- Messages differentiated by sender (right-aligned for current user, left-aligned for others)
- Mobile-responsive design
- Clean, professional dark theme interface
- Real-time connection status tracking

## Project Structure

```
chat-app/
├── server.js              # Express server with Socket.IO configuration
├── package.json           # Project dependencies and scripts
├── messages.json          # Persistent message storage
└── public/
    ├── index.html        # HTML structure
    ├── style.css         # Responsive CSS styling
    └── script.js         # Client-side Socket.IO logic
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies
```bash
npm install
```

This installs:
- `express`: Web server framework
- `socket.io`: Real-time bidirectional communication

### Step 2: Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### Step 3: Access the Application
Open your web browser and navigate to:
```
http://localhost:3000
```

### Testing with Multiple Users
To test the chat functionality:
1. Open multiple browser windows/tabs
2. Navigate to `http://localhost:3000` in each
3. Enter different usernames
4. Start chatting between the windows

## Code Overview

### Server-Side (server.js)

**Key Components:**

1. **Express Setup**: Serves static files from the `public` directory
   ```javascript
   app.use(express.static('public'));
   ```

2. **Socket.IO Connection Handling**: Manages user connections and disconnections
   ```javascript
   io.on('connection', (socket) => {
     // Connection logic
   });
   ```

3. **Message Persistence**: Saves and loads messages from JSON file
   ```javascript
   function loadMessages() { /* ... */ }
   function saveMessages(messages) { /* ... */ }
   ```

4. **Event Handlers**:
   - `user_join`: User enters chat with username
   - `send_message`: Broadcasting messages to all users
   - `typing_start`/`typing_stop`: Typing indicator management
   - `disconnect`: Cleanup when user leaves

### Client-Side (script.js)

**Key Components:**

1. **Socket.IO Client**: Connects to server and handles events
   ```javascript
   const socket = io();
   ```

2. **Event Listeners**:
   - Login form submission
   - Message form submission
   - Typing detection with debouncing

3. **Socket Event Handlers**:
   - `load_history`: Displays chat history on join
   - `receive_message`: Displays new messages
   - `user_connected`/`user_disconnected`: System notifications
   - `online_users`: Updates user list
   - `user_typing`: Shows typing indicator

4. **Helper Functions**:
   - `displayMessage()`: Renders messages with proper styling
   - `formatTime()`: Formats timestamps
   - `scrollToBottom()`: Auto-scrolls chat
   - `escapeHtml()`: XSS prevention

### Frontend (HTML/CSS)

**HTML Structure:**
- Login screen with username input
- Chat interface with header, sidebar (online users), and main chat area
- Message input form with send button

**CSS Features:**
- CSS Grid for responsive layout
- CSS Variables for theming
- Flexbox for component alignment
- Media queries for mobile responsiveness
- Smooth animations and transitions
- Dark theme with professional color scheme

## Security Features

1. **Input Validation**:
   - Username limited to 30 characters
   - Messages limited to 500 characters
   - Trimming whitespace from inputs

2. **Sanitization**:
   - Basic HTML escaping to prevent XSS attacks
   - Input cleaning on both client and server

3. **Error Handling**:
   - Graceful error messages
   - Server-side validation
   - Connection error handling

## Configuration

### Port Configuration
Default port is 3000. To change:

Edit `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

Or set environment variable:
```bash
PORT=8080 npm start
```

### Message History Limit
Messages are limited to the last 200 entries to prevent file bloat.

Edit `server.js` to change:
```javascript
if (messages.length > 200) {
  messages = messages.slice(-200);
}
```

## Troubleshooting

### Port Already in Use
If port 3000 is occupied:
```bash
PORT=3001 npm start
```

### Messages Not Persisting
Ensure the application has write permissions in the project directory for `messages.json`.

### Connection Issues
- Verify Node.js is installed: `node --version`
- Check if server is running: Look for "Chat server running on..." message
- Clear browser cache and reload

## Project Presentation Tips

### Key Points to Explain:

1. **Architecture**:
   - Client-server model with WebSocket connections
   - Event-driven communication pattern
   - Real-time bidirectional data flow

2. **Socket.IO Benefits**:
   - Automatic reconnection
   - Fallback to HTTP long-polling
   - Binary data support
   - Room/namespace support (for scaling)

3. **Design Decisions**:
   - JSON file storage (simple, no database setup required)
   - Vanilla JavaScript (no framework dependencies)
   - Mobile-first responsive design
   - Input validation for security

4. **Scalability Considerations**:
   - Can be upgraded to use Redis for multi-server support
   - Message storage can migrate to MongoDB/PostgreSQL
   - User authentication can be enhanced with JWT
   - Rate limiting can be added for production

## Future Enhancements

Possible improvements for advanced demonstration:
- Private messaging between users
- Message reactions and emojis
- File/image sharing
- User avatars
- Chat rooms/channels
- User authentication with passwords
- Message edit/delete functionality
- Search through message history
- Dark/light theme toggle
- Markdown support in messages

## License

MIT License - Free to use for educational purposes.

## Support

For questions or issues during presentation preparation:
- Review code comments in all files
- Test with multiple browser windows
- Practice explaining the Socket.IO connection flow
- Be prepared to demonstrate real-time features live

---

**Good luck with your presentation!**
