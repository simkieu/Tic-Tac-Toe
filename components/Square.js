import {Text, TouchableOpacity, StyleSheet} from 'react-native';

const Square = ({value, onPress}) => {
    const char = value == 1 ? 'x' : value == 2 ? 'o' : '';

    return (
        <TouchableOpacity style={styles.square} onPress={onPress}>
            <Text style={styles.text}>{char}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    square: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      width: 100,
      height: 100,
      border: '1px solid red',
    },

    text: {
        fontSize: 70
    }
});
  

export default Square;