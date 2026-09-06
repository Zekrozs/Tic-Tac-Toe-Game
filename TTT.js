"use strict";

function DOM(){
  const form = document.getElementById('form')
  const formData = new FormData(form) 
  const formValues = Object.fromEntries(formData)
  const inputFields = document.querySelectorAll('.name')
  
  const getPlayerNames = () =>{
  return Object.values(formValues)
}
const updateFieldText = () => {

}
 return{getPlayerNames}
}


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
    if(row < 0 || row > 2 || column < 0 || column > 2){
      console.log('please mark a valid cell')
      return false
    }  
    if (board[row][column].getValue() !== 0) {
      console.log("cell is already marked");
      return false;
    }

    
    board[row][column].markCell(player);
    return true;
    } 
      
  

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
    roundsWon: 0
  };
  const getPlayerMark = () => player.mark;
  const getPlayerName = () => player.name;
  const incrementWonRounds = () => player.roundsWon++
  const getPlayerScore = () =>player.roundsWon
  const resetScore = () => player.roundsWon = 0
  return { getPlayerMark, getPlayerName,incrementWonRounds,getPlayerScore, resetScore };
}

function gameState() {
  const playersNames = DOM()
  const playerOne = player(playersNames.getPlayerNames()[0], "X");
  const playerTwo = player(playersNames.getPlayerNames()[1], "O");

  const 

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
    const increaseScore = () => activePLayer.incrementWonRounds()
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
      increaseScore()
      console.log(activePLayer.getPlayerScore())
      return true;
    }

    const boardFull = currentBoard.every((row) => {
      return row.every((cell) => cell !== 0);
    });

    if (boardFull) {
      console.log("its a tie!");
      return true;
    }

    return false;
  };

  const resetGame = () => {
    activePLayer = playerOne;
    board.getBoard().forEach((row) => {
      row.forEach((cell) => cell.markCell());
    });
    playerOne.resetScore()
    playerTwo.resetScore
    console.log(board.printBoard());
  };

  const playRound = (row, column) => {
        console.log(`${activePLayer.getPlayerName()}'s turn`);
    if (!board.markSquare(row, column, activePLayer.getPlayerMark())) return;
    console.log(
      `${activePLayer.getPlayerName()} marked row ${row + 1} column ${column + 1}`,
    );
    console.table(board.printBoard());
    if (checkWinner()) return;
    switchTurn();
  };

  return { playRound, resetGame };
}

const game = gameState();
// game.playRound(0, 0); // X
// game.playRound(1, 1); // O
// game.playRound(0, 1); // X
// game.playRound(1, 2); // O
// game.playRound(0, 2); // X
// game.resetGame();
// game.playRound(0, 0); // X
// game.playRound(1, 1); // O
// game.playRound(0, 1); // X
// game.playRound(1, 2); // O
// game.playRound(0, 2); // X

const dialog = document.getElementById('dialog-box')
dialog.showModal()

