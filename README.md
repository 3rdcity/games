# 🏁 Classic Checkers Game

A beautiful, modern web-based checkers game with multiplayer functionality and leaderboard system. Play the classic strategy game right in your browser!

## ✨ Features

### 🎮 Game Features
- **Classic Checkers Rules**: Full implementation of standard American checkers rules
- **Multiplayer Support**: Two players can play on the same device
- **Interactive Gameplay**: Click-to-select and move pieces with visual feedback
- **King Promotion**: Pieces automatically become kings when reaching the opposite end
- **Mandatory Captures**: Enforces capture moves when available
- **Multiple Captures**: Chain captures in a single turn
- **Move Validation**: Prevents illegal moves and guides players
- **Undo Functionality**: Take back your last move
- **Game Status Tracking**: Real-time score and turn indicators

### 🏆 Leaderboard System
- **Game History**: Saves up to 50 recent games
- **Player Names**: Customizable player names for each game
- **Game Statistics**: Tracks moves, duration, captures, and winners
- **Persistent Storage**: Uses browser localStorage to save game history
- **Clear History**: Option to reset the leaderboard

### 🎨 Modern UI/UX
- **Beautiful Design**: Gradient backgrounds and modern styling
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Piece movements and capture effects
- **Visual Feedback**: Highlights valid moves and captures
- **Modal Windows**: Clean game-over and leaderboard interfaces
- **Accessibility**: Clear visual indicators and intuitive controls

## 🎯 How to Play

### Basic Rules
1. **Objective**: Capture all opponent pieces or block all their moves
2. **Movement**: Pieces move diagonally on dark squares only
3. **Direction**: Regular pieces move forward only, kings move in all diagonal directions
4. **Captures**: Jump over opponent pieces to capture them
5. **Multiple Captures**: Continue capturing if more captures are available
6. **King Promotion**: Pieces become kings when reaching the opposite end

### Game Controls
- **Select Piece**: Click on your piece to select it
- **Move**: Click on a highlighted square to move
- **New Game**: Start a fresh game
- **Undo**: Take back the last move
- **Reset**: Restart the current game
- **Leaderboard**: View game history and statistics

### Visual Indicators
- 🟡 **Yellow Highlight**: Selected piece
- 🟢 **Green Highlight**: Valid move destinations
- 🔴 **Red Highlight**: Capture move destinations
- 👑 **Crown Symbol**: King pieces
- ✨ **Animations**: Piece captures and king promotions

## 🚀 Getting Started

### Quick Start
1. Open `index.html` in your web browser
2. Click "New Game" to start playing
3. Red player goes first
4. Click on a piece to select it, then click where you want to move
5. Follow the game prompts and enjoy!

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No additional dependencies required

## 📊 Game Statistics

The leaderboard tracks:
- **Player Names**: Customizable for each game
- **Winner**: Which player won the game
- **Move Count**: Total number of moves in the game
- **Game Duration**: How long the game lasted
- **Captures**: Number of pieces captured by each player
- **Date**: When the game was played

## 🛠️ Technical Details

### Files Structure
```
checkers-game/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and animations
├── script.js       # Game logic and functionality
└── README.md       # This documentation
```

### Technologies Used
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling, flexbox/grid, animations
- **Vanilla JavaScript**: Game logic and DOM manipulation
- **LocalStorage**: Persistent leaderboard data
- **Font Awesome**: Icons and visual elements
- **Google Fonts**: Poppins font family

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎮 Game Rules Reference

### Piece Movement
- Regular pieces move diagonally forward only
- Kings move diagonally in all four directions
- Pieces can only move to empty dark squares

### Capturing
- Jump diagonally over opponent pieces to capture them
- Captured pieces are removed from the board
- If multiple captures are possible, you must continue capturing
- Capturing is mandatory when available

### Winning Conditions
- Capture all opponent pieces
- Block all opponent moves (no legal moves available)

### King Promotion
- Red pieces become kings when reaching row 0 (top)
- Black pieces become kings when reaching row 7 (bottom)
- Kings have enhanced movement in all diagonal directions

## 🤝 Contributing

This is a standalone checkers game implementation. Feel free to:
- Report bugs or issues
- Suggest new features
- Improve the code or documentation
- Add new game variants

## 📄 License

This project is open source and available under the MIT License.

---

Enjoy playing Classic Checkers! 🎉