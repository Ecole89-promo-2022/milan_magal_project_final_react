import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const { isAdmin } = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the App</Text>
            <Text style={styles.subtitle}>What would you like to do?</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
                    <Text style={styles.buttonText}>View Profile</Text>
                </TouchableOpacity>
                {isAdmin && (
                    <TouchableOpacity style={[styles.button, styles.adminButton]} onPress={() => navigation.navigate('Admin')}>
                        <Text style={styles.buttonText}>Admin Panel</Text>
                    </TouchableOpacity>
                )}
            </View>
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
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 15,
        textAlign: 'center',
        color: '#FFF'
    },
    subtitle: {
        fontSize: 20,
        color: '#CCC',
        marginBottom: 35,
        textAlign: 'center'
    },
    buttonContainer: {
        width: '100%'
    },
    button: {
        backgroundColor: '#FF5722',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    adminButton: {
        backgroundColor: '#8E44AD'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700'
    }
});

export default HomeScreen;
