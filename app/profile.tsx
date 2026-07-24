import React from 'react';
import { View, ScrollView, Text, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    ChevronRight,
    Settings,
    Shield,
    Zap,
    MessageCircle,
    MoreHorizontal,
} from 'lucide-react-native';

import { useUIStore } from '../store/useUIStore';

type AccountRow = {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    onPress: () => void;
};

export default function ProfileScreen() {
    const router = useRouter();
    const { userName, avatarUrl } = useUIStore();

    const handleSwipe = ({ nativeEvent }: any) => {
        if (nativeEvent.translationX > 120 && Math.abs(nativeEvent.translationY) < 80) {
            router.push('/');
        }
    };

    const accountRows: AccountRow[] = [
        {
            id: 'general',
            title: 'General',
            subtitle: 'Profile, notifications & storage',
            icon: Settings,
            onPress: () => router.push('/settings'),
        },
        {
            id: 'security',
            title: 'Security',
            subtitle: 'Control how you access your account & card',
            icon: Shield,
            onPress: () => { },
        },
        {
            id: 'powerups',
            title: 'Power ups',
            subtitle: 'Pair with other software',
            icon: Zap,
            onPress: () => { },
        },
        {
            id: 'chat',
            title: 'Chat with Support',
            subtitle: 'Get help using the app',
            icon: MessageCircle,
            onPress: () => { },
        },
    ];

    return (
        <PanGestureHandler onEnded={handleSwipe} activeOffsetX={[-999, 10]} failOffsetY={[-80, 80]}>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Back Button */}
                    <Pressable style={styles.backButton} onPress={() => router.push('/')}>
                        <ArrowLeft size={20} color="#27313F" />
                    </Pressable>

                    {/* Title */}
                    <Text style={styles.pageTitle}>Account</Text>

                    {/* Profile Header */}
                    <View style={styles.profileRow}>
                        {avatarUrl ? (
                            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.avatarInitial}>
                                    {(userName || 'U').charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{userName || 'User Name'}</Text>
                            <Text style={styles.profileSubtitle}>Business Account</Text>
                        </View>
                        <Pressable style={styles.moreButton}>
                            <MoreHorizontal size={20} color="#111827" />
                        </Pressable>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Account Rows */}
                    {accountRows.map((row) => (
                        <Pressable
                            key={row.id}
                            style={styles.accountRow}
                            onPress={row.onPress}
                        >
                            <View style={styles.rowIconWrap}>
                                <row.icon size={22} color="#111827" />
                            </View>
                            <View style={styles.rowContent}>
                                <Text style={styles.rowTitle}>{row.title}</Text>
                                <Text style={styles.rowSubtitle}>{row.subtitle}</Text>
                            </View>
                            <ChevronRight size={20} color="#9CA3AF" />
                        </Pressable>
                    ))}

                    {/* Version */}
                    <Text style={styles.versionText}>Version 3.17.3 (202410211041)</Text>
                </ScrollView>
            </SafeAreaView>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 120,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8EDF2',
        marginLeft: 20,
        marginTop: 12,
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 24,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 14,
    },
    avatarFallback: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#111827',
        marginRight: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        letterSpacing: -0.1,
        marginBottom: 2,
    },
    profileSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#8A94A6',
    },
    moreButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 20,
        marginBottom: 8,
    },
    accountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    rowIconWrap: {
        width: 32,
        alignItems: 'center',
        marginRight: 14,
    },
    rowContent: {
        flex: 1,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        letterSpacing: -0.1,
        marginBottom: 2,
    },
    rowSubtitle: {
        fontSize: 13,
        fontWeight: '400',
        color: '#8A94A6',
    },
    versionText: {
        fontSize: 12,
        fontWeight: '400',
        color: '#9CA3AF',
        textAlign: 'center',
        marginTop: 40,
    },
});