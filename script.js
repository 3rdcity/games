class CheckersGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 'red';
        this.selectedSquare = null;
        this.validMoves = [];
        this.mustCapture = false;
        this.gameOver = false;
        this.capturedPieces = { red: 0, black: 0 };
        this.moveHistory = [];
        this.gameStartTime = null;
        this.totalMoves = 0;

        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.createBoard();
        this.setupInitialPieces();
        this.renderBoard();
        this.updateGameStatus();
        this.gameStartTime = new Date();
    }

    createBoard() {
        this.board = [];
        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                this.board[row][col] = null;
            }
        }
    }

    setupInitialPieces() {
        // Place black pieces (top 3 rows)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    this.board[row][col] = { color: 'black', king: false };
                }
            }
        }

        // Place red pieces (bottom 3 rows)
        for (let row = 5; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    this.board[row][col] = { color: 'red', king: false };
                }
            }
        }
    }

    renderBoard() {
        const boardElement = document.getElementById('gameBoard');
        boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.row = row;
                square.dataset.col = col;

                // Add square coloring
                if ((row + col) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark', 'playable');
                }

                // Add piece if exists
                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece', `${piece.color}-piece`);
                    if (piece.king) {
                        pieceElement.classList.add('king');
                    }
                    square.appendChild(pieceElement);
                }

                square.addEventListener('click', (e) => this.handleSquareClick(row, col, e));
                boardElement.appendChild(square);
            }
        }
    }

    handleSquareClick(row, col, event) {
        if (this.gameOver) return;

        const square = event.currentTarget;
        const piece = this.board[row][col];

        // If clicking on a piece of the current player
        if (piece && piece.color === this.currentPlayer) {
            this.selectPiece(row, col);
        }
        // If clicking on a valid move square
        else if (this.selectedSquare && this.isValidMove(this.selectedSquare.row, this.selectedSquare.col, row, col)) {
            this.makeMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
        }
        // If clicking elsewhere, deselect
        else {
            this.deselectPiece();
        }
    }

    selectPiece(row, col) {
        // Clear previous selection
        this.deselectPiece();

        const piece = this.board[row][col];
        if (!piece || piece.color !== this.currentPlayer) return;

        // Check if this piece has capture moves when captures are mandatory
        if (this.mustCapture) {
            const captureMoves = this.getCaptureMoves(row, col);
            if (captureMoves.length === 0) {
                this.updateGameMessage("You must capture with a piece that can capture!");
                return;
            }
        }

        this.selectedSquare = { row, col };
        this.validMoves = this.getPossibleMoves(row, col);

        // Highlight selected square
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        square.classList.add('selected');

        // Highlight valid moves
        this.validMoves.forEach(move => {
            const moveSquare = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
            if (move.isCapture) {
                moveSquare.classList.add('capture-move');
            } else {
                moveSquare.classList.add('valid-move');
            }
        });

        this.updateGameMessage(`Selected ${piece.color} ${piece.king ? 'king' : 'piece'}. Choose where to move.`);
    }

    deselectPiece() {
        if (this.selectedSquare) {
            const square = document.querySelector(`[data-row="${this.selectedSquare.row}"][data-col="${this.selectedSquare.col}"]`);
            square.classList.remove('selected');
        }

        // Clear move highlights
        document.querySelectorAll('.valid-move, .capture-move').forEach(square => {
            square.classList.remove('valid-move', 'capture-move');
        });

        this.selectedSquare = null;
        this.validMoves = [];
        this.updateGameMessage(`${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}'s turn. Click on a piece to move.`);
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        return this.validMoves.some(move => move.row === toRow && move.col === toCol);
    }

    getPossibleMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        const moves = [];
        const directions = this.getMoveDirections(piece);

        for (const [dRow, dCol] of directions) {
            // Regular move
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (this.isValidPosition(newRow, newCol) && !this.board[newRow][newCol]) {
                if (!this.mustCapture) {
                    moves.push({ row: newRow, col: newCol, isCapture: false });
                }
            }

            // Capture move
            const captureRow = row + (2 * dRow);
            const captureCol = col + (2 * dCol);

            if (this.isValidPosition(captureRow, captureCol) && 
                this.board[newRow][newCol] && 
                this.board[newRow][newCol].color !== piece.color && 
                !this.board[captureRow][captureCol]) {
                moves.push({ 
                    row: captureRow, 
                    col: captureCol, 
                    isCapture: true,
                    capturedRow: newRow,
                    capturedCol: newCol
                });
            }
        }

        return moves;
    }

    getCaptureMoves(row, col) {
        return this.getPossibleMoves(row, col).filter(move => move.isCapture);
    }

    getMoveDirections(piece) {
        if (piece.king) {
            return [[-1, -1], [-1, 1], [1, -1], [1, 1]]; // All diagonal directions
        } else if (piece.color === 'red') {
            return [[-1, -1], [-1, 1]]; // Move up (toward black's side)
        } else {
            return [[1, -1], [1, 1]]; // Move down (toward red's side)
        }
    }

    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const move = this.validMoves.find(move => move.row === toRow && move.col === toCol);
        if (!move) return;

        // Save move to history for undo
        this.moveHistory.push({
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece: { ...this.board[fromRow][fromCol] },
            capturedPiece: move.isCapture ? { ...this.board[move.capturedRow][move.capturedCol] } : null,
            capturedPosition: move.isCapture ? { row: move.capturedRow, col: move.capturedCol } : null,
            player: this.currentPlayer
        });

        // Move the piece
        this.board[toRow][toCol] = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = null;

        let continueTurn = false;

        // Handle capture
        if (move.isCapture) {
            const capturedPiece = this.board[move.capturedRow][move.capturedCol];
            this.board[move.capturedRow][move.capturedCol] = null;
            this.capturedPieces[capturedPiece.color]++;
            
            // Check for additional captures
            const additionalCaptures = this.getCaptureMoves(toRow, toCol);
            if (additionalCaptures.length > 0) {
                continueTurn = true;
                this.selectedSquare = { row: toRow, col: toCol };
                this.validMoves = additionalCaptures;
                this.mustCapture = true;
            }
        }

        // Check for king promotion
        if (this.shouldPromoteToKing(toRow, toCol)) {
            this.board[toRow][toCol].king = true;
            setTimeout(() => {
                const square = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
                const piece = square.querySelector('.piece');
                if (piece) {
                    piece.classList.add('new-king');
                    setTimeout(() => piece.classList.remove('new-king'), 600);
                }
            }, 100);
        }

        this.totalMoves++;
        this.renderBoard();
        this.updateScores();

        if (!continueTurn) {
            this.endTurn();
        } else {
            this.selectPiece(toRow, toCol);
            this.updateGameMessage("Great capture! You can capture again.");
        }

        // Check for game over
        this.checkGameOver();
    }

    shouldPromoteToKing(row, col) {
        const piece = this.board[row][col];
        if (!piece || piece.king) return false;

        return (piece.color === 'red' && row === 0) || (piece.color === 'black' && row === 7);
    }

    endTurn() {
        this.deselectPiece();
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        this.mustCapture = this.checkForMandatoryCaptures();
        this.updateGameStatus();
    }

    checkForMandatoryCaptures() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    const captures = this.getCaptureMoves(row, col);
                    if (captures.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    checkGameOver() {
        const redPieces = this.countPieces('red');
        const blackPieces = this.countPieces('black');
        
        let winner = null;

        // Check if a player has no pieces left
        if (redPieces === 0) {
            winner = 'black';
        } else if (blackPieces === 0) {
            winner = 'red';
        } else {
            // Check if current player has no valid moves
            const hasValidMoves = this.playerHasValidMoves(this.currentPlayer);
            if (!hasValidMoves) {
                winner = this.currentPlayer === 'red' ? 'black' : 'red';
            }
        }

        if (winner) {
            this.gameOver = true;
            this.showGameOverModal(winner);
        }
    }

    countPieces(color) {
        let count = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] && this.board[row][col].color === color) {
                    count++;
                }
            }
        }
        return count;
    }

    playerHasValidMoves(player) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === player) {
                    const moves = this.getPossibleMoves(row, col);
                    if (moves.length > 0) {
                        if (this.mustCapture) {
                            const captures = moves.filter(move => move.isCapture);
                            if (captures.length > 0) return true;
                        } else {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    updateGameStatus() {
        // Update current turn indicator
        const currentTurnElement = document.getElementById('currentTurn');
        currentTurnElement.textContent = `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}'s Turn`;

        // Update player active states
        document.querySelectorAll('.player').forEach(player => {
            player.classList.remove('active');
        });
        document.querySelector(`.player-${this.currentPlayer}`).classList.add('active');

        // Update game message
        if (this.mustCapture) {
            this.updateGameMessage("You must capture! Click on a piece that can capture.");
        } else {
            this.updateGameMessage(`${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}'s turn. Click on a piece to move.`);
        }

        // Update undo button
        const undoBtn = document.getElementById('undoBtn');
        undoBtn.disabled = this.moveHistory.length === 0;
    }

    updateGameMessage(message) {
        document.getElementById('gameMessage').textContent = message;
    }

    updateScores() {
        document.getElementById('redCaptured').textContent = this.capturedPieces.black;
        document.getElementById('blackCaptured').textContent = this.capturedPieces.red;
    }

    undoMove() {
        if (this.moveHistory.length === 0 || this.gameOver) return;

        const lastMove = this.moveHistory.pop();
        
        // Restore piece position
        this.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
        this.board[lastMove.to.row][lastMove.to.col] = null;

        // Restore captured piece if any
        if (lastMove.capturedPiece && lastMove.capturedPosition) {
            this.board[lastMove.capturedPosition.row][lastMove.capturedPosition.col] = lastMove.capturedPiece;
            this.capturedPieces[lastMove.capturedPiece.color]--;
        }

        // Switch back to previous player
        this.currentPlayer = lastMove.player;
        this.totalMoves--;
        
        // Reset game state
        this.deselectPiece();
        this.mustCapture = this.checkForMandatoryCaptures();
        
        this.renderBoard();
        this.updateScores();
        this.updateGameStatus();
    }

    resetGame() {
        this.gameOver = false;
        this.currentPlayer = 'red';
        this.selectedSquare = null;
        this.validMoves = [];
        this.mustCapture = false;
        this.capturedPieces = { red: 0, black: 0 };
        this.moveHistory = [];
        this.totalMoves = 0;
        this.gameStartTime = new Date();

        this.createBoard();
        this.setupInitialPieces();
        this.renderBoard();
        this.updateScores();
        this.updateGameStatus();
    }

    showGameOverModal(winner) {
        const modal = document.getElementById('gameOverModal');
        const winnerMessage = document.getElementById('winnerMessage');
        const totalMovesElement = document.getElementById('totalMoves');
        const gameDurationElement = document.getElementById('gameDuration');

        const duration = Math.floor((new Date() - this.gameStartTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        winnerMessage.textContent = `🎉 ${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins! 🎉`;
        totalMovesElement.textContent = this.totalMoves;
        gameDurationElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        modal.classList.add('show');
    }

    hideGameOverModal() {
        document.getElementById('gameOverModal').classList.remove('show');
    }

    setupEventListeners() {
        // Game controls
        document.getElementById('newGameBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('undoBtn').addEventListener('click', () => this.undoMove());

        // Modal controls
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideGameOverModal();
            this.resetGame();
        });

        document.getElementById('saveGameBtn').addEventListener('click', () => {
            this.saveToLeaderboard();
        });

        // Leaderboard
        document.getElementById('leaderboardBtn').addEventListener('click', () => {
            this.showLeaderboard();
        });

        document.getElementById('closeLeaderboardBtn').addEventListener('click', () => {
            this.hideLeaderboard();
        });

        document.getElementById('clearLeaderboardBtn').addEventListener('click', () => {
            this.clearLeaderboard();
        });

        // Close modals on background click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    }

    saveToLeaderboard() {
        const player1Name = document.getElementById('player1Name').value.trim() || 'Player 1';
        const player2Name = document.getElementById('player2Name').value.trim() || 'Player 2';
        
        const winner = document.getElementById('winnerMessage').textContent.includes('Red') ? 'red' : 'black';
        const duration = document.getElementById('gameDuration').textContent;
        const moves = this.totalMoves;

        const gameData = {
            id: Date.now(),
            player1: player1Name,
            player2: player2Name,
            winner: winner,
            moves: moves,
            duration: duration,
            date: new Date().toLocaleDateString(),
            redCaptured: this.capturedPieces.black,
            blackCaptured: this.capturedPieces.red
        };

        // Save to localStorage
        let leaderboard = JSON.parse(localStorage.getItem('checkersLeaderboard') || '[]');
        leaderboard.unshift(gameData);
        
        // Keep only last 50 games
        if (leaderboard.length > 50) {
            leaderboard = leaderboard.slice(0, 50);
        }

        localStorage.setItem('checkersLeaderboard', JSON.stringify(leaderboard));

        this.hideGameOverModal();
        this.showLeaderboard();
        this.resetGame();
    }

    showLeaderboard() {
        const modal = document.getElementById('leaderboardModal');
        const content = document.getElementById('leaderboardContent');
        
        const leaderboard = JSON.parse(localStorage.getItem('checkersLeaderboard') || '[]');

        if (leaderboard.length === 0) {
            content.innerHTML = '<div class="no-games">No games recorded yet. Play a game to see results here!</div>';
        } else {
            content.innerHTML = leaderboard.map((game, index) => `
                <div class="leaderboard-item">
                    <div class="leaderboard-rank">#${index + 1}</div>
                    <div class="leaderboard-info">
                        <div class="leaderboard-players">
                            ${game.player1} vs ${game.player2}
                        </div>
                        <div class="leaderboard-details">
                            <span>📅 ${game.date}</span>
                            <span>⏱️ ${game.duration}</span>
                            <span>🔴 Captured: ${game.redCaptured}</span>
                            <span>⚫ Captured: ${game.blackCaptured}</span>
                        </div>
                    </div>
                    <div class="leaderboard-stats">
                        <div class="leaderboard-winner">
                            🏆 ${game.winner === 'red' ? game.player1 : game.player2} Wins
                        </div>
                        <div class="leaderboard-moves">${game.moves} moves</div>
                    </div>
                </div>
            `).join('');
        }

        modal.classList.add('show');
    }

    hideLeaderboard() {
        document.getElementById('leaderboardModal').classList.remove('show');
    }

    clearLeaderboard() {
        if (confirm('Are you sure you want to clear all leaderboard data? This cannot be undone.')) {
            localStorage.removeItem('checkersLeaderboard');
            this.showLeaderboard(); // Refresh the display
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.checkersGame = new CheckersGame();
});