import { View, Text, StyleSheet } from 'react-native';

export default function SignUp() {
    return (
        <View style={styles.container}>
            <Text>Welcome to the SignUp Screen!</Text>
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
