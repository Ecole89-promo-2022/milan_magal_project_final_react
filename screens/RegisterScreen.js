import React, { useState, useContext } from 'react';
import { register } from '../services/api';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            await register({ name, email, password });
            Alert.alert(
                'Registration Successful',
                'Your account has been created successfully. You will be redirected to the login page.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (error) {
            Alert.alert('Registration Error', error.response?.data?.message || error.message || 'Unable to create an account');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Sign Up'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
                <Text style={styles.linkText}>Already registered? Log In</Text>
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
        marginTop: 10
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

export default RegisterScreen;
