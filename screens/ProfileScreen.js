import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getProfile } from '../services/api';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

const ProfileScreen = ({ navigation }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { signOut, isAdmin } = useContext(AuthContext);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            setProfile(response.data.data);
        } catch (error) {
            Alert.alert('Error', 'Unable to load your profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        signOut();
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4361ee" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>
            {profile && (
                <View style={styles.profileInfo}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{profile.name}</Text>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{profile.email}</Text>
                    {profile.isAdmin && (
                        <View style={styles.adminBadge}>
                            <Text style={styles.adminText}>Administrator</Text>
                        </View>
                    )}
                </View>
            )}
            <View style={styles.buttonContainer}>
                {isAdmin && (
                    <TouchableOpacity style={[styles.button, styles.adminButton]} onPress={() => navigation.navigate('Admin')}>
                        <Text style={styles.buttonText}>Admin Panel</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        padding: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 25,
        color: '#FFF'
    },
    profileInfo: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3
    },
    label: {
        fontSize: 18,
        color: '#CCC',
        marginBottom: 5
    },
    value: {
        fontSize: 20,
        marginBottom: 20,
        color: '#FFF'
    },
    adminBadge: {
        backgroundColor: '#FF5722',
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginTop: 10
    },
    adminText: {
        color: '#FFF',
        fontWeight: '600'
    },
    buttonContainer: {
        marginTop: 30
    },
    button: {
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    adminButton: {
        backgroundColor: '#8E44AD'
    },
    logoutButton: {
        backgroundColor: '#E74C3C'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700'
    }
});

export default ProfileScreen;
