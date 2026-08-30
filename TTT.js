"use strict";

function gameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }
 const getBoard = () => board

  const markSquare = function (row,column,player) {
  
    if(board[row][column].getValue() !== 0){
        console.log('cell is already marked')
        return
    }
    console.log(board[row][column].getValue())
    board[row][column].markCell() 
    console.log(board[row][column].getValue())

  };

  // creates a 2d array. .map creates an array and throws the result
  // of the loop inside it.
  const printBoard = function(){
    return board.map((row) => 
    row.map(cell => cell.getValue()) )
  }
  return { markSquare,getBoard,printBoard};
}


function cell(){
  let value = 0

  const getValue = () => value

  const markCell = (player) => value = player

  return {getValue,markCell}
}

let game = gameBoard();
game.markSquare(1,2);
console.log(game.getBoard())
console.log(game.printBoard())

