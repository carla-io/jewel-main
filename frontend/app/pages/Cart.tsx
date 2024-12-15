import { View, Text, StyleSheet } from 'react-native';

export default function Cart() {
    return (
        <View style={styles.container}>
            <Text>Welcome to the CartScreen!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
});
