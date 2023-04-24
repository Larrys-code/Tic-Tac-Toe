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
  const playerOne = { name: "Player One", piece: "o" };
  const playerTwo = { name: "Player Two", piece: "x" };
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

  const setPlayerOne = (name, piece) => {
    playerOne.name = name;
    playerOne.piece = piece;
  };
  const setPlayerTwo = (name, piece) => {
    playerTwo.name = name;
    playerTwo.piece = piece;
  };

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
  };
};

const displayGame = (() => {
  const ticTacToe = gameController();
  const container = document.querySelector(".container");
  const checkState = () => {
    if (ticTacToe.checkWin()) {
      return console.log(ticTacToe.checkWin());
    }
    if (ticTacToe.checkDraw()) {
      return console.log("Draw");
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
  return { renderNewBoard };
})();

displayGame.renderNewBoard();
