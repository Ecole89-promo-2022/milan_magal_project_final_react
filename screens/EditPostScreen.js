import React, { useState, useContext, useEffect } from 'react';
import { updatePost, updateOwnPost, getPostById } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';

const EditPostScreen = ({ route, navigation }) => {
    const { postId } = route.params;
    const [title, setTitle] = useState(null);
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isAdmin } = useContext(AuthContext);

    useEffect(() => {
        fetchPostDetails();
    }, []);

    const fetchPostDetails = async () => {
        try {
            const response = await getPostById(postId);
            setTitle(response.data.data.title);
            setContent(response.data.data.content);
        } catch (error) {
            Alert.alert('Error', 'Unable to load post details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Title is required');
            return false;
        }
        if (!content.trim()) {
            Alert.alert('Error', 'Content is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            if (isAdmin) {
                await updatePost(postId, title, content);
            } else {
                await updateOwnPost(postId, title, content);
            }
            Alert.alert('Success', 'Post updated successfully');
            navigation.navigate('PostsList');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Error updating the post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter your post title"
                maxLength={100}
            />
            <Text style={styles.label}>Content</Text>
            <TextInput
                style={styles.contentInput}
                value={content}
                onChangeText={setContent}
                placeholder="Enter your post content"
                multiline
                textAlignVertical="top"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Text style={styles.submitButtonText}>Update</Text>
                )}
            </TouchableOpacity>
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
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#E0E0E0'
    },
    titleInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#333',
        color: '#FFF'
    },
    contentInput: {
        height: 150,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingTop: 15,
        marginBottom: 30,
        fontSize: 16,
        backgroundColor: '#333',
        color: '#FFF'
    },
    submitButton: {
        backgroundColor: '#FF5722',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700'
    }
});

export default EditPostScreen;
