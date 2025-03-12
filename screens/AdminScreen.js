import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/api';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

const AdminScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data.data);
        } catch (error) {
            Alert.alert('Error', 'Unable to load users. Check your admin rights.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUsers();
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
            <Text style={styles.title}>User Management</Text>
            <Text style={styles.subtitle}>Total: {users.length} users</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.userCard}>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{item.name}</Text>
                            <Text style={styles.userEmail}>{item.email}</Text>
                            {item.isAdmin && (
                                <View style={styles.adminBadge}>
                                    <Text style={styles.adminText}>Admin</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyList}>
                        <Text>No users found</Text>
                    </View>
                }
            />
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
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 5,
        color: '#FFF'
    },
    subtitle: {
        fontSize: 16,
        color: '#AAA',
        marginBottom: 25
    },
    listContent: {
        paddingBottom: 20
    },
    userCard: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15
    },
    userInfo: {
        flex: 1
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF'
    },
    userEmail: {
        fontSize: 16,
        color: '#CCC',
        marginTop: 5
    },
    adminBadge: {
        backgroundColor: '#FF5722',
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginTop: 10
    },
    adminText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 12
    },
    emptyList: {
        alignItems: 'center',
        marginTop: 50
    }
});

export default AdminScreen;
