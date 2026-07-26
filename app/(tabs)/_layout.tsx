import React from 'react';
import { Tabs } from 'expo-router';
import { Home, BarChart3, Wallet } from 'lucide-react-native';
import {
    View,
    StyleSheet,
    Pressable,
    Text,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
    surface: '#FFFFFF',
    border: '#E8E8E8',
    active: '#0F172A',      // Dark ink for active
    activeIcon: '#0F172A',  // Same as active
    inactiveIcon: '#94A3B8', // Grey for inactive
    labelActive: '#0F172A',
    labelInactive: '#94A3B8',
};

const TAB_HEIGHT = 56;
const TAB_MARGIN_BOTTOM = 8;
const TABS = ['index', 'budget', 'transactions'] as const;

const TAB_LABELS: Record<string, string> = {
    index: 'Home',
    budget: 'Analytics',
    transactions: 'Transactions',
};

export function useTabBarClearance() {
    const insets = useSafeAreaInsets();
    return TAB_HEIGHT + insets.bottom + TAB_MARGIN_BOTTOM + 24;
}

function TabBarIcon({ focused, Icon }: { focused: boolean; Icon: typeof Home }) {
    return (
        <Icon
            size={24}
            color={focused ? COLORS.activeIcon : COLORS.inactiveIcon}
            strokeWidth={focused ? 2.5 : 2}
        />
    );
}

function TwitterTabBar({ state, descriptors, navigation }: any) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.barContainer,
                {
                    paddingBottom: insets.bottom + TAB_MARGIN_BOTTOM,
                },
            ]}
        >
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
                            android_ripple={{ color: 'rgba(15, 23, 42, 0.05)', borderless: false }}
                        >
                            <TabBarIcon focused={focused} Icon={Icon} />
                            <Text
                                style={[
                                    styles.tabLabel,
                                    { color: focused ? COLORS.labelActive : COLORS.labelInactive },
                                    focused && styles.tabLabelActive,
                                ]}
                            >
                                {label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <TwitterTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{ tabBarIconComponent: Home } as any}
            />
            <Tabs.Screen
                name="budget"
                options={{ tabBarIconComponent: BarChart3 } as any}
            />
            <Tabs.Screen
                name="transactions"
                options={{ tabBarIconComponent: Wallet } as any}
            />
        </Tabs>
    );
}

// ============================================================
// TWITTER-STYLE STYLES – Clean, simple, solid
// ============================================================
const styles = StyleSheet.create({
    barContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    barInner: {
        flexDirection: 'row',
        height: TAB_HEIGHT,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        gap: 2,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: COLORS.labelInactive,
        marginTop: 1,
        letterSpacing: 0.2,
    },
    tabLabelActive: {
        fontWeight: '700',
    },
});