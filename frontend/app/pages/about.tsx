import { View, Text, StyleSheet } from 'react-native';

export default function About() {
    return (
        <View style={styles.container}>
            <Text>Welcome to the About Screen!</Text>
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
