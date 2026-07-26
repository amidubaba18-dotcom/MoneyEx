import React from 'react';
import { View, ScrollView, Text, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    ChevronRight,
    User,
    Bell,
    Lock,
    Moon,
    Globe,
    HelpCircle,
    MessageCircle,
    FileText,
    LogOut,
    MoreHorizontal,
    Trash2,
} from 'lucide-react-native';
import { useUIStore } from '../../store/useUIStore';
import { useThemeMode } from '../../context/ThemeContext';

type AccountRow = {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    onPress: () => void;
    badge?: string;
};

export default function ProfileScreen() {
    const router = useRouter();
    const { userName, avatar, notificationCount } = useUIStore();
    const { isDark } = useThemeMode();

    const accountRows: AccountRow[] = [
        {
            id: 'profile',
            title: 'Edit Profile',
            subtitle: 'Personal information & avatar',
            icon: User,
            onPress: () => router.push('/profile/edit'),
        },
        {
            id: 'notifications',
            title: 'Notifications',
            subtitle: 'Manage your alerts & reminders',
            icon: Bell,
            onPress: () => router.push('/notifications'),
            badge: notificationCount > 0 ? String(notificationCount) : undefined,
        },
        {
            id: 'security',
            title: 'Security',
            subtitle: 'Password, 2FA & biometrics',
            icon: Lock,
            onPress: () => router.push('/security'),
        },
    ];

    const preferenceRows: AccountRow[] = [
        {
            id: 'appearance',
            title: 'Appearance',
            subtitle: 'Light, dark or system theme',
            icon: Moon,
            onPress: () => router.push('/appearance'),
        },
        {
            id: 'language',
            title: 'Language',
            subtitle: 'English (US)',
            icon: Globe,
            onPress: () => router.push('/language'),
        },
    ];

    const supportRows: AccountRow[] = [
        {
            id: 'help',
            title: 'Help Center',
            subtitle: 'FAQs, guides & troubleshooting',
            icon: HelpCircle,
            onPress: () => router.push('/help'),
        },
        {
            id: 'feedback',
            title: 'Send Feedback',
            subtitle: 'Help us improve MoneyEx',
            icon: MessageCircle,
            onPress: () => router.push('/feedback'),
        },
        {
            id: 'legal',
            title: 'Legal & Privacy',
            subtitle: 'Terms of service, privacy policy',
            icon: FileText,
            onPress: () => router.push('/legal'),
        },
    ];

    // ============================================================
    // DATA MANAGEMENT – LINKS TO DEDICATED SCREEN
    // ============================================================

    const dangerRows: AccountRow[] = [
        {
            id: 'dataManagement',
            title: 'Data Management',
            subtitle: 'Reset transactions by day, week, month, or all',
            icon: Trash2,
            onPress: () => router.push('/data-management'),
        },
        {
            id: 'logout',
            title: 'Sign Out',
            subtitle: 'Sign out of your account on this device',
            icon: LogOut,
            onPress: () => {
                router.push('/');
            },
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Pressable style={styles.backButton} onPress={() => router.push('/')}>
                    <ArrowLeft size={20} color={isDark ? '#F1F5F9' : '#0F172A'} strokeWidth={2.5} />
                </Pressable>

                <Text style={[styles.pageTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>Account</Text>

                <View style={[styles.profileRow, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarFallback}>
                            <Text style={styles.avatarInitial}>
                                {(userName || 'U').charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.profileInfo}>
                        <Text style={[styles.profileName, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                            {userName || 'User Name'}
                        </Text>
                        <Text style={[styles.profileSubtitle, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                            Business Account
                        </Text>
                    </View>
                    <Pressable
                        style={styles.moreButton}
                        onPress={() => router.push('/profile/edit')}
                    >
                        <MoreHorizontal size={20} color={isDark ? '#F1F5F9' : '#0F172A'} strokeWidth={2.5} />
                    </Pressable>
                </View>

                <View style={[styles.divider, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]} />

                <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>Account</Text>
                {accountRows.map((row) => (
                    <Pressable
                        key={row.id}
                        style={[styles.accountRow, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
                        onPress={row.onPress}
                    >
                        <View style={styles.rowIconWrap}>
                            <row.icon size={20} color={isDark ? '#94A3B8' : '#64748B'} strokeWidth={2} />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                                {row.title}
                            </Text>
                            <Text style={[styles.rowSubtitle, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                                {row.subtitle}
                            </Text>
                        </View>
                        {row.badge && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{row.badge}</Text>
                            </View>
                        )}
                        <ChevronRight size={18} color={isDark ? '#64748B' : '#94A3B8'} strokeWidth={2} />
                    </Pressable>
                ))}

                <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>Preferences</Text>
                {preferenceRows.map((row) => (
                    <Pressable
                        key={row.id}
                        style={[styles.accountRow, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
                        onPress={row.onPress}
                    >
                        <View style={styles.rowIconWrap}>
                            <row.icon size={20} color={isDark ? '#94A3B8' : '#64748B'} strokeWidth={2} />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                                {row.title}
                            </Text>
                            <Text style={[styles.rowSubtitle, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                                {row.subtitle}
                            </Text>
                        </View>
                        <ChevronRight size={18} color={isDark ? '#64748B' : '#94A3B8'} strokeWidth={2} />
                    </Pressable>
                ))}

                <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>Support & Legal</Text>
                {supportRows.map((row) => (
                    <Pressable
                        key={row.id}
                        style={[styles.accountRow, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
                        onPress={row.onPress}
                    >
                        <View style={styles.rowIconWrap}>
                            <row.icon size={20} color={isDark ? '#94A3B8' : '#64748B'} strokeWidth={2} />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={[styles.rowTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                                {row.title}
                            </Text>
                            <Text style={[styles.rowSubtitle, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>
                                {row.subtitle}
                            </Text>
                        </View>
                        <ChevronRight size={18} color={isDark ? '#64748B' : '#94A3B8'} strokeWidth={2} />
                    </Pressable>
                ))}

                <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#94A3B8' }]}>Data Management</Text>
                {dangerRows.map((row) => (
                    <Pressable
                        key={row.id}
                        style={[
                            styles.accountRow,
                            { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
                            row.id === 'dataManagement' && styles.dangerRow,
                        ]}
                        onPress={row.onPress}
                    >
                        <View style={styles.rowIconWrap}>
                            <row.icon
                                size={20}
                                color={row.id === 'dataManagement' ? '#EF4444' : (isDark ? '#94A3B8' : '#64748B')}
                                strokeWidth={2}
                            />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={[
                                styles.rowTitle,
                                {
                                    color:
                                        row.id === 'dataManagement' ? '#EF4444' :
                                        (isDark ? '#F1F5F9' : '#0F172A')
                                }
                            ]}>
                                {row.title}
                            </Text>
                            <Text style={[
                                styles.rowSubtitle,
                                {
                                    color:
                                        row.id === 'dataManagement' ? '#FCA5A5' :
                                        (isDark ? '#94A3B8' : '#94A3B8')
                                }
                            ]}>
                                {row.subtitle}
                            </Text>
                        </View>
                        <ChevronRight size={18} color={isDark ? '#64748B' : '#94A3B8'} strokeWidth={2} />
                    </Pressable>
                ))}

                <Text style={[styles.versionText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                    MoneyEx v3.17.3 (Build 202410211041)
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 120 },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
        marginLeft: 20,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 20,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 8,
    },
    avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 14, backgroundColor: '#E2E8F0' },
    avatarFallback: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#0F172A',
        marginRight: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
    profileSubtitle: { fontSize: 13, fontWeight: '500' },
    moreButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
    },
    divider: { height: 1, marginHorizontal: 20, marginBottom: 16 },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingHorizontal: 20,
        marginBottom: 4,
        marginTop: 16,
    },
    accountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginHorizontal: 16,
        borderRadius: 12,
        marginBottom: 2,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    dangerRow: {
        borderColor: '#FEE2E2',
    },
    rowIconWrap: { width: 32, alignItems: 'center', marginRight: 14 },
    rowContent: { flex: 1 },
    rowTitle: { fontSize: 15, fontWeight: '600', marginBottom: 1 },
    rowSubtitle: { fontSize: 13, fontWeight: '400' },
    badge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginRight: 8,
    },
    badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
    versionText: {
        fontSize: 12,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 32,
        paddingBottom: 16,
    },
});
