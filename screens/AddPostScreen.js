import React, { useState } from 'react';
import { addPost } from '../services/api';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';

const AddPostScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

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
            await addPost(title, content);
            Alert.alert('Success', 'Post created successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Error creating the post');
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
                    <Text style={styles.submitButtonText}>Post</Text>
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

export default AddPostScreen;