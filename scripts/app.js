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
  return { getRawBoard, getPOne, getPTwo, playLegalMove };
};

const ticTacToe = (() => {
  let board = gameBoard();
  let playerOneTurn = true;
  const playerOne = { name: "Player One", piece: "O" };
  const playerTwo = { name: "Player Two", piece: "X" };
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

  const playTurn = (row, column) => {
    if (board.playLegalMove(row, column, playerOneTurn)) {
      turnSwitch();
    }
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
    if (
      board.getRawBoard() ===
      [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]
    )
      return true;
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
    if (winner[0]) return winner;
    return false;
  };

  return {
    playTurn,
    resetGame,
    getBoard,
    checkWin,
    setPlayerOne,
    setPlayerTwo,
  };
})();
ticTacToe.playTurn(0, 0);
ticTacToe.playTurn(0, 1);
ticTacToe.playTurn(1, 0);
ticTacToe.playTurn(1, 1);
// ticTacToe.playTurn(2, 0);
console.log(ticTacToe.getBoard());
console.log(ticTacToe.checkWin());
