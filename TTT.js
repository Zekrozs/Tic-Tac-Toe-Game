"use strict";

const board = (function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }
  const getBoard = () => board;

  const markSquare = function (row, column, player) {
    if (board[row][column].getValue() !== 0) {
      console.log("cell is already marked");
      return;
    }

    board[row][column].markCell(player);
  };

  // creates a 2d array. .map creates an array and throws the result
  // of the loop inside it.
  const printBoard = function () {
    return board.map((row) => row.map((cell) => cell.getValue()));
  };
  return { markSquare, getBoard, printBoard };
})();

function cell() {
  let value = 0;

  const getValue = () => value;

  const markCell = (player) => (value = player || 0);

  return { getValue, markCell };
}

function player(name, mark) {
  const player = {
    name: name,
    mark: mark,
  };
  const getPlayerMark = () => player.mark;
  const getPlayerName = () => player.name;
  return { getPlayerMark, getPlayerName };
}

function gameState() {
  const playerOne = player("playerOne", "X");
  const playerTwo = player("PlayerTwo", "O");

  let activePLayer = playerOne;
  const switchTurn = () => {
    if (activePLayer === playerOne) {
      activePLayer = playerTwo;
    } else {
      activePLayer = playerOne;
    }
  };

  const checkWinner = () => {
    const currentBoard = board.printBoard();
    const playerMark = activePLayer.getPlayerMark();
    const winningLines = [
      ...currentBoard,

      [currentBoard[0][0], currentBoard[1][0], currentBoard[2][0]],
      [currentBoard[0][1], currentBoard[1][1], currentBoard[2][1]],
      [currentBoard[0][2], currentBoard[1][2], currentBoard[2][2]],

      [currentBoard[0][0], currentBoard[1][1], currentBoard[2][2]],
      [currentBoard[2][0], currentBoard[1][1], currentBoard[0][2]],
    ];

    const winner = winningLines.some((line) => {
      return line.every((cell) => cell === playerMark);
    });

    if (winner) {
      console.log(`${activePLayer.getPlayerName()} wins!`);
      return true;
    }
    
    const boardFull = currentBoard.every(row=>{
     return row.every(cell => cell !== 0)
    })

    if(boardFull){
      console.log('its a tie!')
      return false
    }

    return false;
  };

  const resetGame = () => {
    activePLayer = playerOne
    board.getBoard().forEach(row => {
      row.forEach(cell => cell.markCell())})
      console.log(board.printBoard())
  }

  const playRound = (row, column) => {
    console.log(`${activePLayer.getPlayerName()}'s turn`);
    console.log(
      `${activePLayer.getPlayerName()} marked row ${row + 1} column ${column + 1}`,
    );
    board.markSquare(row, column, activePLayer.getPlayerMark());
    console.table(board.printBoard());
    checkWinner();
    switchTurn();
  };

  return { playRound,resetGame };
}

const game = gameState();
game.playRound(1, 1);
game.playRound(2, 1);
game.playRound(1, 0);
game.playRound(2, 0);
game.playRound(1, 2);
// game.playRound(0, 0); // X
// game.playRound(0, 1); // O
// game.playRound(0, 2); // X
// game.playRound(1, 1); // O
// game.playRound(1, 0); // X
// game.playRound(1, 2); // O
// game.playRound(2, 1); // X
// game.playRound(2, 0); // O
// game.playRound(2, 2); // X
game.resetGame()
