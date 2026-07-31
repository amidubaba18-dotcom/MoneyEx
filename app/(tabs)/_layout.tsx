// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Wallet, TrendingUp, Receipt, Settings2 } from 'lucide-react-native';
import { View, StyleSheet, Pressable, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_HEIGHT = 56;
const TAB_MARGIN_BOTTOM = 8;

const TAB_LABELS: Record<string, string> = {
    index: 'Overview',
    reports: 'Analytics',
    activity: 'Transactions',
    settings: 'Settings',
};

const COLORS = {
    isDark: true,
    tabActiveIcon: '#FFFFFF',
    tabInactiveIcon: 'rgba(255,255,255,0.5)',
    tabLabelActive: '#FFFFFF',
    tabLabelInactive: 'rgba(255,255,255,0.4)',
};

export function useTabBarClearance() {
    const insets = useSafeAreaInsets();
    return TAB_HEIGHT + insets.bottom + TAB_MARGIN_BOTTOM + 24;
}

function TabBarIcon({ focused, Icon }: { focused: boolean; Icon: any }) {
    return (
        <Icon
            size={24}
            color={focused ? COLORS.tabActiveIcon : COLORS.tabInactiveIcon}
            strokeWidth={focused ? 2.5 : 1.8}
        />
    );
}

function TabBar({ state, descriptors, navigation }: any) {
    const insets = useSafeAreaInsets();

    const bottomInset = Platform.OS === 'android'
        ? Math.max(insets.bottom, 8)
        : insets.bottom;

    return (
        <View
            style={[
                styles.wrapper,
                { paddingBottom: bottomInset + TAB_MARGIN_BOTTOM },
            ]}
            pointerEvents="box-none"
        >
            <View style={styles.barContainer}>
                <View style={styles.barInner}>
                    {state.routes.map((route: any, index: number) => {
                        const { options } = descriptors[route.key];
                        const focused = state.index === index;
                        const Icon = options.tabBarIconComponent;
                        const label = TAB_LABELS[route.name] || route.name;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });
                            if (!focused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        return (
                            <Pressable
                                key={route.key}
                                style={styles.tabItem}
                                onPress={onPress}
                                hitSlop={8}
                                android_ripple={{ color: 'rgba(255,255,255,0.04)', borderless: true, radius: 28 }}
                            >
                                {focused && <View style={styles.activeDot} />}
                                <TabBarIcon focused={focused} Icon={Icon} />
                                <Text
                                    style={[
                                        styles.tabLabel,
                                        { color: focused ? COLORS.tabLabelActive : COLORS.tabLabelInactive },
                                    ]}
                                >
                                    {label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" options={{ tabBarIconComponent: Wallet } as any} />
            <Tabs.Screen name="reports" options={{ tabBarIconComponent: TrendingUp } as any} />
            <Tabs.Screen name="activity" options={{ tabBarIconComponent: Receipt } as any} />
            <Tabs.Screen name="settings" options={{ tabBarIconComponent: Settings2 } as any} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
    },
    barContainer: {
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.85)',
    },
    barInner: {
        flexDirection: 'row',
        height: TAB_HEIGHT,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        gap: 2,
    },
    activeDot: {
        position: 'absolute',
        top: 2,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '500',
        marginTop: 1,
        letterSpacing: 0.2,
    },
});