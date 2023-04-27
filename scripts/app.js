const gameBoard = () => {
  const board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const playerOne = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const playerTwo = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const checkLegal = (row, column) => {
    const boardRow = board[row];
    const boardCell = boardRow[column];
    if (boardCell === 0) return true;
    return false;
  };
  const insertPiece = (boardArray, row, column) => {
    const boardRow = boardArray[row];
    boardRow.splice(column, 1, 1);
  };
  const playLegalMove = (row, column, firstPlayer = true) => {
    if (!checkLegal(row, column)) return false;
    insertPiece(board, row, column);
    if (firstPlayer) {
      insertPiece(playerOne, row, column);
    } else {
      insertPiece(playerTwo, row, column);
    }
    return true;
  };
  const getRawBoard = () => board;
  const getPOne = () => playerOne;
  const getPTwo = () => playerTwo;
  return { getRawBoard, getPOne, getPTwo, playLegalMove, checkLegal };
};

const gameController = () => {
  let board = gameBoard();
  let playerOneTurn = true;
  const playerOne = { name: "Player One", piece: "o", score: 0, is: 1 };
  const playerTwo = { name: "Player Two", piece: "x", score: 0, is: 2 };
  const winningStates = [
    [
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [1, 1, 1],
    ],
    [
      [1, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    [
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
    ],
  ];
  const resetGame = () => {
    board = gameBoard();
    playerOneTurn = true;
    return board;
  };

  const turnSwitch = () => {
    switch (playerOneTurn) {
      case true:
        playerOneTurn = false;
        break;
      case false:
        playerOneTurn = true;
        break;
      default:
    }
  };

  const whosTurn = () => {
    switch (playerOneTurn) {
      case true:
        return playerOne;
      case false:
        return playerTwo;
      default:
        return playerOne;
    }
  };

  const playTurn = (row, column) => {
    if (board.playLegalMove(row, column, playerOneTurn)) {
      turnSwitch();
      return true;
    }
    return false;
  };

  const setPlayerOne = (name = "Player One") => {
    playerOne.name = name;
    playerOne.score = 0;
  };
  const setPlayerTwo = (name = "Player Two") => {
    playerTwo.name = name;
    playerTwo.score = 0;
  };

  const getPlayerOne = () => playerOne;
  const getPlayerTwo = () => playerTwo;

  const getBoard = () => {
    const fullBoard = board.getRawBoard();
    const playerTwoBoard = board.getPTwo();
    fullBoard.forEach((row, rowIndex) => {
      const playerTwoRow = playerTwoBoard[rowIndex];
      row.forEach((cell, columnIndex) => {
        if (cell === 1 && cell === playerTwoRow[columnIndex])
          row.splice(columnIndex, 1, 2);
      });
    });
    return fullBoard;
  };

  const checkDraw = () => {
    const rawBoard = board.getRawBoard();
    if (rawBoard.every((row) => row.every((cell) => cell === 1))) return true;
    return false;
  };

  const checkWin = () => {
    const players = [
      [playerOne, board.getPOne()],
      [playerTwo, board.getPTwo()],
    ];
    const winner = [];
    players.forEach((playerArray) => {
      const playerBoard = playerArray[1];
      const winStates = JSON.parse(JSON.stringify(winningStates));
      winStates.forEach((winState) => {
        winState.forEach((winStateRow, rowIndex) => {
          winStateRow.forEach((cell, columnIndex) => {
            if (cell === 1 && playerBoard[rowIndex][columnIndex] === 1) {
              winStateRow.splice(columnIndex, 1, 0);
            }
          });
        });
      });
      if (
        winStates.some((winState) =>
          winState.every((row) => row.every((cell) => cell === 0))
        )
      )
        winner.push(playerArray[0]);
    });
    if (winner[0]) return winner[0];
    return false;
  };

  return {
    playTurn,
    whosTurn,
    resetGame,
    getBoard,
    checkWin,
    checkDraw,
    setPlayerOne,
    setPlayerTwo,
    getPlayerOne,
    getPlayerTwo,
  };
};

// To do:
// Move board to one array
// AI
const displayGame = (() => {
  const ticTacToe = gameController();
  const container = document.querySelector(".container");
  const addResultCover = (result) => {
    const board = document.querySelector(".board");
    const cover = document.createElement("div");
    cover.classList.add("cover");
    board.appendChild(cover);
    const card = document.createElement("div");
    card.classList.add("result");
    if (result === "draw") {
      card.textContent = "You Drew";
    } else {
      card.textContent = `${result} Won!`;
    }
    cover.appendChild(card);
  };
  const renderScore = () => {
    const playerOne = ticTacToe.getPlayerOne();
    const playerTwo = ticTacToe.getPlayerTwo();
    const score = document.querySelector(".score");
    score.textContent = `${playerOne.score} : ${playerTwo.score}`;
  };
  const toggleDisplayTurn = () => {
    const playerOneContainer = document.querySelector(".player-tag-1");
    const playerTwoContainer = document.querySelector(".player-tag-2");
    playerOneContainer.classList.toggle("is-turn");
    playerTwoContainer.classList.toggle("is-turn");
  };
  const renderScoreboard = () => {
    const scoreboard = document.createElement("div");
    scoreboard.classList.add("scoreboard");
    const playerOne = ticTacToe.getPlayerOne();
    const playerTwo = ticTacToe.getPlayerTwo();
    [playerOne, playerTwo].forEach((player) => {
      const playerContainer = document.createElement("div");
      const playerPiece = document.createElement("div");
      const playerName = document.createElement("h1");
      playerContainer.classList.add(`player-tag-${player.is}`);
      if (player === playerOne) {
        playerContainer.classList.add("is-turn");
      }
      playerPiece.textContent = `${player.piece}`;
      playerPiece.classList.add("marker");
      playerName.textContent = `${player.name}`;
      playerContainer.appendChild(playerPiece);
      playerContainer.appendChild(playerName);
      scoreboard.appendChild(playerContainer);
    });
    const score = document.createElement("div");
    score.classList.add("score");
    scoreboard.appendChild(score);
    container.appendChild(scoreboard);
    renderScore();
  };
  const checkState = () => {
    if (ticTacToe.checkWin()) {
      addResultCover(ticTacToe.checkWin().name);
      ticTacToe.checkWin().score += 1;
      return renderScore();
    }
    if (ticTacToe.checkDraw()) {
      return addResultCover("draw");
    }
    return false;
  };
  const handleCellClick = (cell) => {
    const { row, column } = cell.dataset;
    const player = ticTacToe.whosTurn();
    if (ticTacToe.playTurn(row, column)) {
      cell.textContent = `${player.piece}`;
      cell.classList.remove("hover");
      cell.classList.add("filled");
      cell.classList.add(`${player.piece}`);
      toggleDisplayTurn();
      checkState();
    }
  };
  const handleCellHover = (cell) => {
    if (!cell.classList.contains("filled")) {
      const player = ticTacToe.whosTurn();
      cell.classList.toggle("hover");
      cell.classList.toggle(`${player.piece}`);
      if (!cell.textContent) {
        cell.textContent = `${player.piece}`;
      } else {
        cell.textContent = "";
      }
    }
  };
  const renderNewBoard = () => {
    ticTacToe.resetGame();
    const board = document.createElement("div");
    board.classList.add("board");
    // add buttons
    for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < 3; columnIndex += 1) {
        const cell = document.createElement("button");
        cell.classList.add("cell");
        cell.dataset.row = rowIndex;
        cell.dataset.column = columnIndex;
        cell.addEventListener("click", () => {
          handleCellClick(cell);
        });
        cell.addEventListener("mouseover", () => {
          handleCellHover(cell);
        });
        cell.addEventListener("mouseout", () => {
          handleCellHover(cell);
        });
        board.appendChild(cell);
      }
    }
    // add hash grid
    for (let columnIndex = 2; columnIndex < 5; columnIndex += 2) {
      const cross = document.createElement("div");
      cross.classList.add("cross");
      cross.classList.add("y");
      cross.style.gridRow = "1/-1";
      cross.style.gridColumn = `${columnIndex}/${columnIndex + 1}`;
      cross.ariaHidden = true;
      board.appendChild(cross);
    }
    for (let rowIndex = 2; rowIndex < 5; rowIndex += 2) {
      const cross = document.createElement("div");
      cross.classList.add("cross");
      cross.classList.add("x");
      cross.style.gridColumn = "1/-1";
      cross.style.gridRow = `${rowIndex}/${rowIndex + 1}`;
      cross.ariaHidden = true;
      board.appendChild(cross);
    }
    container.appendChild(board);
  };
  const renderBoardControls = () => {
    const boardControls = document.createElement("div");
    const newMatchButton = document.createElement("button");
    const exitButton = document.createElement("button");

    boardControls.classList.add("board-controls");
    newMatchButton.classList.add("new-match");
    exitButton.classList.add("exit");

    exitButton.textContent = "exit";
    newMatchButton.textContent = "new match";

    newMatchButton.addEventListener("click", () => {
      const board = document.querySelector(".board");
      container.removeChild(board);
      container.removeChild(boardControls);
      renderNewBoard();
      renderBoardControls();
      const playerTwoContainer = document.querySelector(".player-tag-2");
      if (playerTwoContainer.classList.contains("is-turn")) {
        toggleDisplayTurn();
      }
    });
    exitButton.addEventListener("click", () => {
      // eslint-disable-next-line no-use-before-define
      renderStartScreen();
    });

    boardControls.appendChild(exitButton);
    boardControls.appendChild(newMatchButton);
    container.appendChild(boardControls);
  };
  const renderNewGame = () => {
    container.textContent = "";
    renderScoreboard();
    renderNewBoard();
    renderBoardControls();
  };

  const renderPlayerForm = (player) => {
    const form = document.createElement("form");
    const playerName = document.createElement("input");
    form.classList.add("player-form");
    form.setAttribute("id", `player-${player.is}`);
    playerName.setAttribute("name", "name");
    playerName.setAttribute("type", "text");
    playerName.setAttribute("value", `${player.name}`);
    form.appendChild(playerName);
    return form;
  };

  const renderAIForm = (player) => {
    const form = document.createElement("form");
    const playerName = document.createElement("input");
    const aiFlag = document.createElement("input");
    const difficultyButton = document.createElement("input");
    form.classList.add("player-form");
    form.setAttribute("id", `player-${player.is}`);
    playerName.setAttribute("name", "name");
    playerName.setAttribute("type", "text");
    playerName.setAttribute("value", "Computer");
    playerName.setAttribute("readonly", true);
    aiFlag.setAttribute("name", "isAI");
    aiFlag.setAttribute("type", "hidden");
    aiFlag.setAttribute("value", true);
    difficultyButton.setAttribute("name", "difficulty");
    difficultyButton.setAttribute("type", "button");
    difficultyButton.setAttribute("value", "easy");
    difficultyButton.addEventListener("click", () => {
      switch (difficultyButton.getAttribute("value")) {
        case "easy":
          difficultyButton.setAttribute("value", "medium");
          break;
        case "medium":
          difficultyButton.setAttribute("value", "hard");
          break;
        case "hard":
          difficultyButton.setAttribute("value", "easy");
          break;
        default:
      }
    });
    form.appendChild(playerName);
    form.appendChild(difficultyButton);
    form.appendChild(aiFlag);
    return form;
  };

  const handlePlayerToggle = (
    clickedButton,
    playerToggle,
    aiToggle,
    player,
    formContainer
  ) => {
    if (clickedButton.classList.contains("active")) return false;
    aiToggle.classList.toggle("active");
    playerToggle.classList.toggle("active");
    const form = formContainer.querySelector("form");
    if (clickedButton.classList.contains("ai")) {
      form.replaceWith(renderAIForm(player));
    } else {
      form.replaceWith(renderPlayerForm(player));
    }
    return true;
  };

  const handleStartButton = () => {
    const playerOneForm = document.querySelector("form#player-1");
    const playerTwoForm = document.querySelector("form#player-2");
    const playerOneData = new FormData(playerOneForm);
    const playerTwoData = new FormData(playerTwoForm);
    ticTacToe.setPlayerOne(playerOneData.get("name"));
    ticTacToe.setPlayerTwo(playerTwoData.get("name"));
    renderNewGame();
  };

  const renderStartScreen = () => {
    container.textContent = "";
    ticTacToe.setPlayerOne();
    ticTacToe.setPlayerTwo();
    const selectContainer = document.createElement("div");
    const playerOne = ticTacToe.getPlayerOne();
    const playerTwo = ticTacToe.getPlayerTwo();
    const title = document.createElement("h1");
    title.classList.add("title");
    title.textContent = "Tic Tac Toe";
    selectContainer.appendChild(title);
    [playerOne, playerTwo].forEach((player) => {
      const formContainer = document.createElement("div");
      const token = document.createElement("div");
      formContainer.classList.add("form-container");
      formContainer.classList.add(`player-${player.is}`);
      token.classList.add("select-screen-token");
      token.classList.add(`${player.piece}`);
      token.textContent = `${player.piece}`;
      formContainer.appendChild(token);
      formContainer.appendChild(renderPlayerForm(player));

      const playerToggle = document.createElement("button");
      const aiToggle = document.createElement("button");
      playerToggle.classList.add("player");
      playerToggle.classList.add("active");
      playerToggle.textContent = "Player";
      aiToggle.classList.add("ai");
      aiToggle.textContent = "Computer";
      [playerToggle, aiToggle].forEach((button) => {
        button.addEventListener("click", function playerAIToggleClick() {
          handlePlayerToggle(
            this,
            playerToggle,
            aiToggle,
            player,
            formContainer
          );
        });
        formContainer.appendChild(button);
      });
      selectContainer.appendChild(formContainer);
    });
    selectContainer.classList.add("start-screen");
    const startButton = document.createElement("button");
    startButton.classList.add("start-button");
    startButton.textContent = "start";
    startButton.addEventListener("click", () => {
      handleStartButton();
    });
    selectContainer.appendChild(startButton);
    container.appendChild(selectContainer);
  };
  return { renderNewGame, renderStartScreen };
})();

displayGame.renderNewGame();
