import React, { useState, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getPostById, deletePost, deleteOwnPost } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

const PostDetailScreen = ({ route, navigation }) => {
    const { postId } = route.params;
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useContext(AuthContext);

    useEffect(() => {
        fetchPostDetails();
    }, []);

    const fetchPostDetails = async () => {
        try {
            const response = await getPostById(postId);
            setPost(response.data.data);
        } catch (error) {
            Alert.alert('Error', 'Unable to load post details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEditPost = () => {
        if (post) {
            navigation.navigate('EditPost', { postId: post.id });
        }
    };

    const handleDeletePost = async () => {
        if (post) {
            Alert.alert(
                'Confirmation',
                'Are you sure you want to delete this post?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                isAdmin ? await deletePost(post.id) : deleteOwnPost(post.id);
                                Alert.alert('Success', 'Post deleted successfully');
                                navigation.goBack();
                            } catch (error) {
                                Alert.alert('Error', 'Unable to delete the post');
                            }
                        }
                    }
                ]
            );
        }
    };

    const checkAuthor = (authorId) => {
        return authorId === profile?.id;
    };

    const canModifyPost = (authorId) => {
        return isAdmin || checkAuthor(authorId);
    };

    const canDeletePost = (authorId) => {
        return isAdmin || checkAuthor(authorId);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4361ee" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {post && (
                <>
                    <View style={styles.header}>
                        <Text style={styles.title}>{post.title}</Text>
                        <View style={styles.metaInfo}>
                            <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
                            {post.updatedAt !== post.createdAt && (
                                <Text style={styles.edited}>(Updated on {formatDate(post.updatedAt)})</Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.contentText}>{post.content}</Text>
                    </View>
                    {(canModifyPost(post.userId) || canDeletePost(post.userId)) && (
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleEditPost}>
                                <Ionicons name="pencil" size={18} color="white" />
                                <Text style={styles.actionButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDeletePost}>
                                <Ionicons name="trash" size={18} color="white" />
                                <Text style={styles.actionButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E'
    },
    contentContainer: {
        padding: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        marginBottom: 25
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 15,
        color: '#FFF'
    },
    metaInfo: {
        marginBottom: 10
    },
    date: {
        fontSize: 14,
        color: '#AAA'
    },
    edited: {
        fontSize: 12,
        color: '#777',
        fontStyle: 'italic',
        marginTop: 3
    },
    content: {
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#444'
    },
    contentText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#E0E0E0'
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 35,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#444'
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 10,
        marginLeft: 12
    },
    editButton: {
        backgroundColor: '#FF5722'
    },
    deleteButton: {
        backgroundColor: '#E74C3C'
    },
    actionButtonText: {
        color: '#FFF',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600'
    }
});

export default PostDetailScreen;
