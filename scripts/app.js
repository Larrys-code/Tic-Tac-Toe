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
  const getBoard = () => board;
  const getPOne = () => playerOne;
  const getPTwo = () => playerTwo;
  return { getBoard, getPOne, getPTwo, playLegalMove };
};

const ticTacToe = () => {
  const playerOne = { name: "Player One", piece: "O" };
  const playerTwo = { name: "Player Two", piece: "X" };
  const setPlayerOne = (name, piece) => {
    playerOne.name = name;
    playerOne.piece = piece;
  };
  const setPlayerTwo = (name, piece) => {
    playerTwo.name = name;
    playerTwo.piece = piece;
  };
  const board = gameBoard();
  return { setPlayerOne, setPlayerTwo };
};
