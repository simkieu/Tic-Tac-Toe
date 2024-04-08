import {Text, TouchableOpacity, StyleSheet} from 'react-native';

const Square = ({value, onPress}) => {
    const char = value == 1 ? 'x' : value == 2 ? 'o' : '';

    return (
        <TouchableOpacity style={styles.square} onPress={onPress}>
            <Text>{char}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    square: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30px',
      height: '30px',
      border: '1px solid red',
    },
});
  

export default Square;