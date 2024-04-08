import { StyleSheet, View } from 'react-native';
import Square from './components/Square';
import { useState } from 'react';

const App = () => {
  let is2Players = false;
  const width = 3;
  const height = 3;
  const [board, setBoard] = useState(Array(height).fill().map(() => Array(width).fill(0)));
  const [isPlayingX, setIsPlayingX] = useState(false);

  const handlePress = (row, col) => {
    const squares = [...board];
    if (board[row][col] == 0) {
      if (isPlayingX) {
        squares[row][col] = 1;
      } else {
        squares[row][col] = 2;
      }
      setBoard(squares);
      setIsPlayingX(!isPlayingX);
    }
  }

  return (
    <View style={styles.container}>
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
});

export default App;