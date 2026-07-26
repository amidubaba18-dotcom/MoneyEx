import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Fingerprint, Shield, Key, ChevronRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const PASSWORD_STORAGE_KEY = '@moneyex_user_password';
const BIOMETRIC_STORAGE_KEY = '@moneyex_biometric_enabled';

export default function SecurityScreen() {
    const router = useRouter();

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    // Biometric state
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

    // Load saved state on mount
    useEffect(() => {
        loadBiometricState();
        checkBiometricAvailability();
    }, []);

    const checkBiometricAvailability = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsBiometricAvailable(compatible && enrolled);
    };

    const loadBiometricState = async () => {
        try {
            const saved = await AsyncStorage.getItem(BIOMETRIC_STORAGE_KEY);
            setBiometricEnabled(saved === 'true');
        } catch (error) {
            console.error('Error loading biometric state:', error);
        }
    };

    const handleBiometricToggle = async (value: boolean) => {
        if (value && isBiometricAvailable) {
            // Verify biometric before enabling
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Verify your identity to enable biometric login',
                fallbackLabel: 'Use password',
            });
            if (result.success) {
                setBiometricEnabled(true);
                await AsyncStorage.setItem(BIOMETRIC_STORAGE_KEY, 'true');
                Alert.alert('Success', 'Biometric login enabled');
            } else {
                Alert.alert('Failed', 'Biometric verification failed');
            }
        } else if (!value) {
            setBiometricEnabled(false);
            await AsyncStorage.setItem(BIOMETRIC_STORAGE_KEY, 'false');
            Alert.alert('Success', 'Biometric login disabled');
        } else {
            Alert.alert('Not Available', 'Please set up Face ID or Fingerprint in your device settings first.');
        }
    };

    const handleChangePassword = async () => {
        // Validate current password
        if (!currentPassword) {
            Alert.alert('Error', 'Please enter your current password');
            return;
        }

        // Validate new password
        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters');
            return;
        }

        // Validate confirm password
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        // Get stored password (for demo, check if exists)
        const storedPassword = await AsyncStorage.getItem(PASSWORD_STORAGE_KEY);
        if (storedPassword && storedPassword !== currentPassword) {
            Alert.alert('Error', 'Current password is incorrect');
            return;
        }

        // Save new password
        await AsyncStorage.setItem(PASSWORD_STORAGE_KEY, newPassword);

        // Reset fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordFields(false);

        Alert.alert('Success', 'Password changed successfully!');
    };

   


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
                    </Pressable>
                    <Text style={styles.title}>Security</Text>
                    <View style={{ width: 36 }} />
                </View>

                {/* Change Password Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Lock size={18} color="#0F172A" strokeWidth={2} />
                        <Text style={styles.sectionTitle}>Change Password</Text>
                    </View>

                    {!showPasswordFields ? (
                        <Pressable
                            style={styles.actionButton}
                            onPress={() => setShowPasswordFields(true)}
                        >
                            <Text style={styles.actionButtonText}>Change Password</Text>
                            <ChevronRight size={18} color="#94A3B8" strokeWidth={2} />
                        </Pressable>
                    ) : (
                        <View style={styles.passwordFields}>
                            <TextInput
                                style={styles.input}
                                placeholder="Current Password"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="New Password (min 6 chars)"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry
                                value={newPassword}
                                onChangeText={setNewPassword}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm New Password"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <View style={styles.passwordActions}>
                                <Pressable
                                    style={[styles.passwordButton, styles.cancelButton]}
                                    onPress={() => {
                                        setShowPasswordFields(false);
                                        setCurrentPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                    }}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.passwordButton, styles.savePasswordButton]}
                                    onPress={handleChangePassword}
                                >
                                    <Text style={styles.savePasswordButtonText}>Update Password</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                </View>

                {/* Biometric Login Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Fingerprint size={18} color="#0F172A" strokeWidth={2} />
                        <Text style={styles.sectionTitle}>Biometric Login</Text>
                    </View>
                    <View style={styles.biometricRow}>
                        <View style={styles.biometricInfo}>
                            <Text style={styles.biometricTitle}>
                                {isBiometricAvailable ? 'Face ID / Fingerprint' : 'Not Available'}
                            </Text>
                            <Text style={styles.biometricDescription}>
                                {isBiometricAvailable
                                    ? 'Use biometrics to quickly log in'
                                    : 'Set up Face ID or Fingerprint in device settings'}
                            </Text>
                        </View>
                        <Switch
                            value={biometricEnabled}
                            onValueChange={handleBiometricToggle}
                            trackColor={{ false: '#E2E8F0', true: '#0F172A' }}
                            thumbColor={biometricEnabled ? '#FFFFFF' : '#FFFFFF'}
                            ios_backgroundColor="#E2E8F0"
                            disabled={!isBiometricAvailable}
                        />
                    </View>
                </View>

                

                <Text style={styles.versionText}>Security settings are stored locally on your device</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollContent: { paddingBottom: 120 },
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

    section: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
    comingSoonTitle: { color: '#94A3B8' },

    // Password Section
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    actionButtonText: { fontSize: 14, fontWeight: '500', color: '#0F172A' },
    passwordFields: { gap: 12 },
    input: {
        backgroundColor: '#F1F5F9',
        borderRadius: 10,
        padding: 14,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        color: '#0F172A',
    },
    passwordActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    passwordButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cancelButtonText: { color: '#0F172A', fontWeight: '600', fontSize: 14 },
    savePasswordButton: {
        backgroundColor: '#0F172A',
    },
    savePasswordButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },

    // Biometric Section
    biometricRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    biometricInfo: { flex: 1, marginRight: 12 },
    biometricTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
    biometricDescription: { fontSize: 13, fontWeight: '400', color: '#94A3B8', marginTop: 2 },

    versionText: {
        fontSize: 12,
        fontWeight: '400',
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 20,
    },

   
});
