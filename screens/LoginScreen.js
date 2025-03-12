import React, { useState, useContext } from 'react';
import { login } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const response = await login(email, password);
            signIn({ token: response.data.token });
        } catch (error) {
            Alert.alert('Login Error', error.response?.data?.message || 'Unable to log in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log In'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkButton}>
                <Text style={styles.linkText}>Not registered? Create an account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 25,
        textAlign: 'center',
        color: '#FFF'
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#333',
        color: '#FFF'
    },
    button: {
        backgroundColor: '#FF5722',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700'
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center'
    },
    linkText: {
        color: '#FF5722',
        fontSize: 16
    }
});

export default LoginScreen;
