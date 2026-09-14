"use strict";

const DOM = {
  form: document.getElementById("form"),
  playersScreenNames: document.querySelectorAll(".name"),
  dialog: document.getElementById("dialog-box"),
  mainPage: document.querySelector(".main-container"),
  cells: document.querySelectorAll(".cell"),
};

const gameController = (() => {
  let game;
  let allNames;
  const handleFormSubmit = (e) => {
    e.preventDefault();
    allNames = getPlayersNames();
    const validated = validation(allNames);
    if (!validated) return false;
    paintScreen.updateNames(allNames);
    paintScreen.turn(allNames[0]);
    closeDialog();
    return true;
  };

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
    const submitted = handleFormSubmit(e);
    if (!submitted) return;
    game = gameState(allNames);
    paintScreen.updateScores(
      game.getPlayerOneScore(),
      game.getPlayerTwoScore(),
    );
    paintScreen.resetBoard(DOM.cells);
    DOM.form.reset();
    game.resetGame();
  });

  DOM.mainPage.addEventListener("click", (e) => {
    const target = e.target;
    const dialogBtn = target.closest('[data-button="show-modal"]');

    if (dialogBtn) {
      openDialog();
    }

    const restartBtn = target.closest('[data-button = "reset"]');

    if (restartBtn) {
      paintScreen.resetBoard(DOM.cells);
      game.resetGame();
    }

    const cell = target.closest('[data-button="cell"]');
    if (cell) {
      if (!game) {
        alert("Please enter the player names first.");
        return;
      }
      const cellIndex = cell.dataset.cell;
      const cellRow = Math.floor(cellIndex / 3);
      const cellColumn = cellIndex % 3;

      const result = game.playRound(cellRow, cellColumn);

      paintScreen.renderMark(cell, result.mark);
      paintScreen.deactivateCell(cell);

      if (result.status === "invalid") {
        return;
      }

      if (result.status === "win") {
        paintScreen.renderWinner(result.playerName);
        game.resetGame();
        paintScreen.resetBoard(DOM.cells);
        return result;
      }

      if (result.status === "tie") {
        paintScreen.renderTie();
        game.resetGame();
        paintScreen.resetBoard(DOM.cells);
        return result;
      }
      paintScreen.updateScores(
        game.getPlayerOneScore(),
        game.getPlayerTwoScore(),
      );

      paintScreen.turn(result.nextPlayer);
    }
  });
})();

const paintScreen = (() => {
  const updateNames = (names) => {
    DOM.playersScreenNames.forEach(
      (name, index) => (name.textContent = names[index]),
    );
  };
  const updateScores = (P1Score, P2Score) => {
    const playerOneScoreEl = document.querySelector(
      ".player-one .rounds-won p",
    );
    const playerTwoScoreEl = document.querySelector(
      ".player-two .rounds-won p",
    );
    playerOneScoreEl.textContent = `score: ${P1Score}`;
    playerTwoScoreEl.textContent = `score: ${P2Score}`;
  };

  const turn = (player) => {
    const playerTurnEl = document.querySelector(".active-player");
    playerTurnEl.textContent = `${player}'s turn`;
  };

  const renderMark = (sqaure, mark) => (sqaure.textContent = mark);

  const renderWinner = (winner) => {
    alert(`round winner: ${winner}`);
  };
  const resetBoard = (cells) => {
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("inactive");
    });
  };
  const deactivateCell = (clickedCell) => {
    clickedCell.classList.add("inactive");
  };

  const renderTie = () => alert("players tied");

  return {
    updateNames,
    updateScores,
    turn,
    renderMark,
    renderWinner,
    resetBoard,
    deactivateCell,
    renderTie,
  };
})();

const board = function gameBoard() {
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
};

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
  const gameBoard = board();
  const playerOne = player(players[0], "X");
  const playerTwo = player(players[1], "O");
  const getPlayerOneScore = () => playerOne.getPlayerScore();
  const getPlayerTwoScore = () => playerTwo.getPlayerScore();
  const getCurrentName = () => activePLayer.getPlayerName()
  const getCurrentMark = () => activePLayer.getPlayerMark()

  let activePLayer = playerOne;
  const switchTurn = () => {
    if (activePLayer === playerOne) {
      activePLayer = playerTwo;
    } else {
      activePLayer = playerOne;
    }
  };
  const checkWinner = () => {
    const currentBoard = gameBoard.printBoard();
    const playerMark = getCurrentMark()
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
      increaseScore();
      return { status: "win", player: activePLayer };
    }

    const boardFull = currentBoard.every((row) => {
      return row.every((cell) => cell !== 0);
    });

    if (boardFull) {
      return { status: "tie" };
    }

    return { status: "playing" };
  };

  const resetGame = () => {
    activePLayer = playerOne;
    gameBoard.getBoard().forEach((row) => {
      row.forEach((cell) => cell.markCell());
    });
  };

  const playRound = (row, column) => {
    const playerName = getCurrentName();
    const mark = getCurrentMark();
    const moveAccepted = gameBoard.markSquare(
      row,
      column,
      activePLayer.getPlayerMark(),
    );
    if (!moveAccepted) {
      return { status: "invalid" };
    }
    const result = checkWinner();
    if (result.status === "win") {
      return {
        ...result,
        mark,
        playerName,
      };
    }

    if (result.status === "tie") {
      return {
        ...result,
        mark,
      };
    }

    switchTurn();
    return {
      status: "playing",
      mark,
      nextPlayer: activePLayer.getPlayerName(),
    };
  };

  return {
    playRound,
    resetGame,
    getPlayerOneScore,
    getPlayerTwoScore,
    // playerName,
    // activePlayerMark,
  };
}
