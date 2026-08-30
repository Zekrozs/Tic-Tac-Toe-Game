"use strict";

function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push('');
    }
  }
 const getBoard = () => board

  const markSquare = function (row,column) {
    const avaliableBoardSpace= board.filter((rows) => rows[column] === '');
  
    if(board[row][column] !== ''){
        console.log('cell is already filled')
        return
    }
    board[row][column] = '1'

  };

  return { markSquare,getBoard, markSquare };
}

let game = gameBoard();
game.markSquare(1,2);
game.markSquare(0,1);
console.log(game.getBoard())

