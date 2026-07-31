import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ChevronRight,
    DollarSign,
    FolderOpen,
    RotateCcw,
    Bell,
    BellRing,
} from 'lucide-react-native';
import { useTabBarClearance } from './_layout';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useAllCategories } from '../../store/useCategoryStore';

// ---------------------------------------------------------------------------
// Same design system as the rest of the app: dark neutral bg, off-white
// primary text, muted gray secondary text, hairline dividers, 24px gutters.
// ---------------------------------------------------------------------------

const COLORS = {
    bg: '#1A1A1A',
    textPrimary: '#F2F2F0',
    textMuted: '#8A8A87',
    hairline: 'rgba(242,242,240,0.06)',
};

type SettingsRow = {
    id: string;
    title: string;
    subtitle?: string;
    icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
    onPress?: () => void;
    toggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
    rightText?: string;
    chevron?: boolean;
};

export default function SettingsScreen() {
    const router = useRouter();
    const tabBarClearance = useTabBarClearance();
    const currencyCode = useCurrencyStore((s) => s.code);
    const categoriesCount = useAllCategories().length;

    const [autoCapture, setAutoCapture] = React.useState(false);
    const [sendNotifications, setSendNotifications] = React.useState(true);

    const generalRows: SettingsRow[] = [
        {
            id: 'currency',
            title: 'Currency',
            subtitle: currencyCode || 'GHS',
            icon: DollarSign,
            onPress: () => router.push('/currency'),
            chevron: true,
        },
        {
            id: 'categories',
            title: 'Categories',
            subtitle: `${categoriesCount} categories`,
            icon: FolderOpen,
            onPress: () => router.push('/categories'),
            chevron: true,
        },
    ];

    const automationRows: SettingsRow[] = [
        {
            id: 'recurring',
            title: 'Recurring expenses',
            subtitle: 'Rent, subscriptions and other repeats',
            icon: RotateCcw,
            onPress: () => router.push('/recurring'),
            chevron: true,
        },
        {
            id: 'autoCapture',
            title: 'Auto-capture',
            subtitle: 'Capture from notifications',
            icon: Bell,
            toggle: true,
            toggleValue: autoCapture,
            onToggle: setAutoCapture,
            rightText: autoCapture ? 'On' : 'Off',
        },
        {
            id: 'sendNotifications',
            title: 'Send notifications',
            subtitle: sendNotifications ? 'Alerts you to captured spends' : 'Off',
            icon: BellRing,
            toggle: true,
            toggleValue: sendNotifications,
            onToggle: setSendNotifications,
        },
    ];

    const renderRow = (row: SettingsRow) => {
        const Icon = row.icon;
        const interactive = !!row.onPress || !!row.toggle;

        return (
            <TouchableOpacity
                key={row.id}
                style={styles.row}
                onPress={row.onPress}
                activeOpacity={0.7}
                disabled={!row.onPress}
                accessibilityRole={row.onPress ? 'button' : undefined}
                accessibilityLabel={row.title}
            >
                <View style={styles.rowLeft}>
                    <View style={styles.iconWrap}>
                        <Icon size={18} color={COLORS.textMuted} strokeWidth={2} />
                    </View>
                    <View style={styles.rowText}>
                        <Text style={styles.rowTitle}>{row.title}</Text>
                        {row.subtitle && (
                            <Text style={styles.rowSubtitle} numberOfLines={1}>
                                {row.subtitle}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={styles.rowRight}>
                    {row.rightText && (
                        <Text style={[styles.rowRightText, row.toggle && styles.rowRightTextToggle]}>
                            {row.rightText}
                        </Text>
                    )}
                    {row.toggle && (
                        <Switch
                            value={row.toggleValue}
                            onValueChange={row.onToggle}
                            trackColor={{ false: 'rgba(255,255,255,0.15)', true: '#4ADE80' }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor="rgba(255,255,255,0.15)"
                        />
                    )}
                    {row.chevron && (
                        <ChevronRight size={18} color={COLORS.textMuted} strokeWidth={2} />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarClearance + 24 }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Settings</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>
                    {generalRows.map(renderRow)}
                </View>

                

                <Text style={styles.versionText}>MoneyEx v3.17.3</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bg },
    scrollContent: { paddingHorizontal: 24 },
    title: {
        fontSize: 22, fontWeight: '600', color: COLORS.textPrimary,
        marginTop: 4, marginBottom: 24,
    },
    section: { marginBottom: 28 },
    sectionTitle: {
        fontSize: 13, fontWeight: '600', color: COLORS.textMuted,
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
    },
    row: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.hairline,
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconWrap: { width: 32, alignItems: 'center', marginRight: 12 },
    rowText: { flex: 1 },
    rowTitle: { fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
    rowSubtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 1 },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    rowRightText: { fontSize: 13, color: COLORS.textMuted },
    rowRightTextToggle: { minWidth: 30, textAlign: 'right' },
    versionText: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 16 },
});