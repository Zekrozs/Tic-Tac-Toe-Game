"use strict";

let DOM = (() => {
  const form = document.getElementById("form");
  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData);
  const playersScreenNames = document.querySelectorAll(".name");
  const dialog = document.getElementById("dialog-box");
  const mainPage = document.querySelector(".main-container");

  return { formValues, playersScreenNames, dialog, form, dialog, mainPage };
})();

const gameController = (() => {
  let allNames;
  const handleFormSubmit = (e) => {
    e.preventDefault();
    allNames = getPlayersNames();
    const validated = validation(allNames);
    if (!validated) return;
    paintScreen.updateNames(allNames);
    closeDialog();
    return true;
  };

  const game = () => gameState(allNames);

  const getPlayersNames = () => {
    const formData = new FormData(DOM.form);
    const formValues = Object.fromEntries(formData);
    return Object.values(formValues);
  };

  const validation = (names) => {
    const emptyFields = names.some((field) => field === "");
    if (emptyFields) {
      alert("all fields are required");
      return false;
    }
    return true;
  };

  const openDialog = () => DOM.dialog.showModal();
  const closeDialog = () => DOM.dialog.close();

  DOM.form.addEventListener("submit", (e) => {
    handleFormSubmit(e);
    game()
  });

  DOM.mainPage.addEventListener("click", (e) => {
    const target = e.target;
    const dialogBtn = target.closest('[data-game="show-modal"]');

    if (dialogBtn) {
      openDialog();
    }
  });
})();

const paintScreen = (() => {
  const allPlayers = Object.values(DOM.formValues);
  const updateNames = (names) => {
    DOM.playersScreenNames.forEach(
      (name, index) => (name.textContent = names[index]),
    );
  };
  return { updateNames, allPlayers };
})();

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
    if (row < 0 || row > 2 || column < 0 || column > 2) {
      console.log("please mark a valid cell");
      return false;
    }
    if (board[row][column].getValue() !== 0) {
      console.log("cell is already marked");
      return false;
    }

    board[row][column].markCell(player);
    return true;
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
    roundsWon: 0,
  };
  const getPlayerMark = () => player.mark;
  const getPlayerName = () => player.name;
  const incrementWonRounds = () => player.roundsWon++;
  const getPlayerScore = () => player.roundsWon;
  const resetScore = () => (player.roundsWon = 0);
  return {
    getPlayerMark,
    getPlayerName,
    incrementWonRounds,
    getPlayerScore,
    resetScore,
  };
}

function gameState(players) {
  const playerOne = player(players[0], "X");
  const playerTwo = player(players[1], "O");
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
    const increaseScore = () => activePLayer.incrementWonRounds();
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
      increaseScore();
      console.log(activePLayer.getPlayerScore());
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
    playerOne.resetScore();
    playerTwo.resetScore();
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

  return { playRound, resetGame, checkWinner };
}

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
