import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUIStore } from '../../store/useUIStore';

export default function EditProfileScreen() {
    const router = useRouter();
    const { userName, avatar, setUserName, setAvatar } = useUIStore();
    const [name, setName] = useState(userName || '');
    const [selectedImage, setSelectedImage] = useState<string | null>(avatar);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please allow access to your photos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setSelectedImage(uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please allow access to your camera.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setSelectedImage(uri);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
    };

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }
        setUserName(name.trim());
        setAvatar(selectedImage);
        Alert.alert('Success', 'Profile updated successfully!');
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.title}>Edit Profile</Text>
                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Save size={20} color="#2563EB" strokeWidth={2.5} />
                </Pressable>
            </View>

            <View style={styles.content}>
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage }} style={styles.avatarLarge} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {(name || 'U').charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <View style={styles.cameraIcon}>
                            <Camera size={18} color="#FFFFFF" strokeWidth={2.5} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.avatarActions}>
                        <Pressable style={styles.actionButton} onPress={pickImage}>
                            <Text style={styles.actionText}>Choose from Gallery</Text>
                        </Pressable>
                        <Pressable style={styles.actionButton} onPress={takePhoto}>
                            <Text style={styles.actionText}>Take Photo</Text>
                        </Pressable>
                        {selectedImage && (
                            <Pressable style={[styles.actionButton, styles.removeButton]} onPress={removeImage}>
                                <X size={16} color="#EF4444" strokeWidth={2.5} />
                                <Text style={[styles.actionText, styles.removeText]}>Remove</Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your full name"
                        placeholderTextColor="#94A3B8"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 20,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    title: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
    saveButton: { padding: 8 },
    content: { paddingHorizontal: 20, marginTop: 20, flex: 1 },
    avatarSection: { alignItems: 'center', marginBottom: 32 },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E2E8F0',
        marginBottom: 12,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#0F172A',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: { color: '#FFFFFF', fontSize: 40, fontWeight: '700' },
    cameraIcon: {
        position: 'absolute',
        bottom: 12,
        right: 0,
        backgroundColor: '#2563EB',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    avatarActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 8,
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    removeButton: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FEE2E2',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionText: { fontSize: 14, fontWeight: '500', color: '#0F172A' },
    removeText: { color: '#EF4444' },
    field: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 8 },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        color: '#0F172A',
    },
});
