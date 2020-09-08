import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
    <button className="square" onClick={props.onClick}>
        {props.value}
    </button>
    );
}
let scores = {
    X: -10,
    O: 10, 
    tie: 0
}

let human = 'X';
let ai = 'O';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        if (checkWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = 'X' ;
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });

        setTimeout(() => { this.computerMove(squares)}, 1000);
    }

    
    
    computerMove(squares) {

        // call minimax 
        let avail_positions = this.getAvailableSquares(squares);
        let bestScore = -Infinity;
        let bestMove;

        for (var spot = 0; spot < avail_positions.length; spot++) {
            let idx = avail_positions[spot]
            squares[idx] = "O"
            let score = this.minimax(squares, false);
            squares[idx] = null

            if (score > bestScore) {
                bestScore = score
                bestMove = idx
            }
        }
        squares[bestMove] = 'O';
        console.log("best move: " + bestMove)
        console.log("best score: " + bestScore)
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    minimax(squares, isMaximizing) {
        let result = checkWinner(squares);
        if (result !== null) {
            return scores[result];
        }
        var avail_positions = this.getAvailableSquares(squares)

        if (isMaximizing) {
            //console.log("maximizing" + squares)
            let bestScore = -Infinity;

            for (var spot = 0; spot < avail_positions.length; spot++) {
                let idx = avail_positions[spot]
                squares[idx] = "O"
                let score = this.minimax(squares, false);
                squares[idx] = null

                bestScore = Math.max(bestScore, score)
            }
            return bestScore
        } else {
            //console.log("minimizing" + squares)
            let bestScore = Infinity;

            for (var spot = 0; spot < avail_positions.length; spot++) {
                let idx = avail_positions[spot]
                squares[idx] = "X"
                let score = this.minimax(squares, true);
                squares[idx] = null

                bestScore = Math.min(bestScore, score)
            }
            return bestScore
        } 
    }
    
    getAvailableSquares(squares) {
        var avail_squares = []
        for (var i = 0; i < squares.length; i++) {
            if (squares[i] == null) {
                avail_squares.push(i)
            }
        }
        return avail_squares
    }

    renderSquare(i) {
        return (
        <Square
            value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}
        />
        );
    }

    render() {
        const winner = checkWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
        <div className="game">
            <div className="game-board">
                <Board />
            </div>
            <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
            </div>
        </div>
        );
    }
}

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
        }
    }
    return null;
}

function checkWinner(board) {
    let winner = null;
  
    // horizontal
    for (let i = 0; i < 9; i+=3) {
      if (equals3(board[i], board[i + 1], board[i + 2])) {
        winner = board[i];
      }
    }
  
    // Vertical
    for (let i = 0; i < 3; i++) {
      if (equals3(board[i], board[i + 3], board[i + 6])) {
        winner = board[i];
      }
    }
  
    // Diagonal
    if (equals3(board[0], board[4], board[8])) {
      winner = board[0];
    }
    if (equals3(board[2], board[4], board[6])) {
      winner = board[2];
    }
  
    let openSpots = 0;
    for (let i = 0; i < 9; i++) {
        if (board[i] == null) {
          openSpots++;
        }
    }
  
    if (winner == null && openSpots == 0) {
      return 'tie';
    } else {
      return winner;
    }
  }

  function equals3(a, b, c) {
    return a == b && b == c && a != null;
  }