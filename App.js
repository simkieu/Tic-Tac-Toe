import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Square from './components/Square';
import { useState, useEffect } from 'react';

const width = 3;
const height = 3;
const boardLen = width*height;
let slotSet = new Set(Array.from({ length: boardLen }, (_, index) => index));

const GameModeModal = ({ isVisible, onSelectMode }) => {
  return (
    <Modal
      visible={isVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Game Mode</Text>
          <TouchableOpacity style={styles.modeButton} onPress={() => onSelectMode(false)}>
            <Text style={styles.modeButtonText}>Play with AI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeButton} onPress={() => onSelectMode(true)}>
            <Text style={styles.modeButtonText}>Play with Human</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const App = () => {
  const [is2Players, setIs2Players] = useState(false);
  const squaresToWin = 3;
  const maxDepth = 10;
  const [board, setBoard] = useState(Array(height).fill().map(() => Array(width).fill(0)));
  const [isPlayingX, setIsPlayingX] = useState(true);
  const [winner, setWinner] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);

  useEffect(() => {
    if (!is2Players && !isPlayer1Turn) {
      const timeout = setTimeout(() => {
        playComputerMove();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isPlayer1Turn]);

  const playComputerMove = () => {
    const bestMove = findBestMove();
    handlePress(bestMove[0], bestMove[1]);
  }

  const handlePress = (row, col) => {
    const squares = [...board];
    if (board[row][col] === 0 && winner === 0) {
      if (isPlayingX) {
        squares[row][col] = 1;
      } else {
        squares[row][col] = 2;
      }
      slotSet.delete(row * width + col);
      setBoard(squares);
      const winner = checkWinner(board, row, col);
      if (winner != 0) {
        setWinner(winner);
        return;
      }
      setIsPlayer1Turn(!isPlayer1Turn);
      setIsPlayingX(!isPlayingX);
    }
  }

  const findBestMove = () => {
    const boardCopy = [...board];
    let bestScore = -2;
    let bestMove = []
    const availableSquares = new Set(slotSet);
    for (const square of availableSquares) {
      const row = Math.floor(square/width);
      const col = square%width;
      const score = minimax(boardCopy, row, col, false, maxDepth, availableSquares);
      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }
    return bestMove;
  }

  const minimax = (boardCopy, row, col, isMaximizing, depthLeft, availableSquares) => {
    const availableSquaresCopy = new Set(availableSquares);
    availableSquaresCopy.delete(row*width + col);
    if (isMaximizing) {
      boardCopy[row][col] = 2;
      let bestScore = -1;
      const result = checkWinner(boardCopy, row, col);
      if (result > 0 || depthLeft === 0 || availableSquaresCopy.size === 0) {
        bestScore = result === 1 ? -1 : result === 2 ? 1 : 0;
      } else {
        for (const square of availableSquaresCopy) {
          const r = Math.floor(square/width);
          const c = square%width;
          const score = minimax(boardCopy, r, c, false, depthLeft - 1, availableSquaresCopy);
          bestScore = Math.max(bestScore, score);
        }
      }
      boardCopy[row][col] = 0;
      return bestScore;
    } else {
      boardCopy[row][col] = 1;
      let bestScore = 1;
      const result = checkWinner(boardCopy, row, col);
      if (result > 0 || depthLeft === 0 || availableSquaresCopy.size === 0) {
        bestScore = result === 1 ? -1 : result === 2 ? 1 : 0;
      } else {
        for (const square of availableSquaresCopy) {
          const r = Math.floor(square/width);
          const c = square%width;
          const score = minimax(boardCopy, r, c, true, depthLeft - 1, availableSquaresCopy);
          bestScore = Math.min(bestScore, score);
        }
      }
      boardCopy[row][col] = 0;
      return bestScore;
    }
  }

  const checkWinner = (curBoard, row, col) => {
    let horizontalCount = 1;
    let verticalCount = 1;
    let diagCount = 1;
    let invDiagCount = 1;
    let i = 1;
    while (horizontalCount < squaresToWin && col-i >= 0 && curBoard[row][col-i] == curBoard[row][col]) {
      horizontalCount++;
      i++;
    }
    i = 1;
    while (horizontalCount < squaresToWin && col+i < width && curBoard[row][col+i] == curBoard[row][col]) {
      horizontalCount++;
      i++;
    }
    if (horizontalCount == squaresToWin) {
      return curBoard[row][col];
    }
    i = 1;
    while (verticalCount < squaresToWin && row-i >= 0 && curBoard[row-i][col] == curBoard[row][col]) {
      verticalCount++;
      i++;
    }
    i = 1;
    while (verticalCount < squaresToWin && row+i < height && curBoard[row+i][col] == curBoard[row][col]) {
      verticalCount++;
      i++;
    }
    if (verticalCount == squaresToWin) {
      return curBoard[row][col];
    }
    i = 1;
    while (diagCount < squaresToWin && row-i >= 0 && col-i >= 0 && curBoard[row-i][col-i] == curBoard[row][col]) {
      diagCount++;
      i++;
    }
    i = 1;
    while (diagCount < squaresToWin && row+i < height && col+i < height && curBoard[row+i][col+i] == curBoard[row][col]) {
      diagCount++;
      i++;
    }
    if (diagCount == squaresToWin) {
      return curBoard[row][col];
    }
    i = 1;
    while (invDiagCount < squaresToWin && row-i >= 0 && col+i < height && curBoard[row-i][col+i] == curBoard[row][col]) {
      invDiagCount++;
      i++;
    }
    i = 1;
    while (invDiagCount < squaresToWin && row+i < height && col-i >= 0 && curBoard[row+i][col-i] == curBoard[row][col]) {
      invDiagCount++;
      i++;
    }
    if (invDiagCount == squaresToWin) {
      return curBoard[row][col];
    }
    return 0;
  }

  const handleSelectMode = (is2Players) => {
    setIs2Players(is2Players);
    setIsModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <GameModeModal
        isVisible={isModalVisible}
        onSelectMode={handleSelectMode}
      />
      <View>
        <Text>{winner == 1 ? 'x won' : winner == 2 ? 'o won' : '' }</Text>
      </View>
      <View>
        <Text>{isPlayer1Turn ? 'Your turn to play' : 'Opponent turn' }</Text>
      </View>
      <View>
        <Text>{is2Players ? '2 players mode' : 'Playing with an AI' }</Text>
      </View>
      <View>
        <Text>{isPlayingX ? 'x' : 'o'} turn</Text>
      </View>
      {board.map((row, rowInd) => 
      <View style={styles.row}>
        {row.map((col, colInd) => <Square value={board[rowInd][colInd]} onPress={() => handlePress(rowInd, colInd)}/>)}
      </View>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  modeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectedModeText: {
    fontSize: 20,
  },
});

export default App;
