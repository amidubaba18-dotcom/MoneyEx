import React from 'react';
import { Tabs } from 'expo-router';
import { Home, BarChart3, Wallet } from 'lucide-react-native';
import {
    View,
    StyleSheet,
    useWindowDimensions,
    Animated,
    Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
    surface: '#FFFFFF',
    border: '#EEF0F3',
    active: '#111827',
    activeIcon: '#FFFFFF',
    inactiveIcon: '#9CA3AF',
};

const TAB_HEIGHT = 62;
const TAB_MARGIN_BOTTOM = 16;
const TABS = ['index', 'budget', 'transactions'] as const;

export function useTabBarClearance() {
    const insets = useSafeAreaInsets();
    return TAB_HEIGHT + insets.bottom + TAB_MARGIN_BOTTOM + 24;
}

function TabIcon({ focused, Icon }: { focused: boolean; Icon: typeof Home }) {
    const scale = React.useRef(new Animated.Value(focused ? 1 : 0.92)).current;

    React.useEffect(() => {
        Animated.spring(scale, {
            toValue: focused ? 1 : 0.92,
            useNativeDriver: true,
            friction: 7,
            tension: 140,
        }).start();
    }, [focused]);

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Icon
                size={22}
                color={focused ? COLORS.activeIcon : COLORS.inactiveIcon}
                strokeWidth={focused ? 2.4 : 2}
            />
        </Animated.View>
    );
}

function ModernTabBar({ state, descriptors, navigation }: any) {
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const sideInset = width < 420 ? 16 : 32;
    const barWidth = width - sideInset * 2;
    const itemWidth = barWidth / TABS.length;
    const pillSize = 44;

    const translateX = React.useRef(new Animated.Value(state.index * itemWidth)).current;

    React.useEffect(() => {
        Animated.spring(translateX, {
            toValue: state.index * itemWidth,
            useNativeDriver: true,
            friction: 9,
            tension: 120,
        }).start();
    }, [state.index, itemWidth]);

    return (
        <View
            style={[
                styles.barContainer,
                {
                    left: sideInset,
                    right: sideInset,
                    bottom: insets.bottom + TAB_MARGIN_BOTTOM,
                    height: TAB_HEIGHT,
                },
            ]}
        >
            <Animated.View
                style={[
                    styles.pillIndicator,
                    {
                        width: pillSize,
                        height: pillSize,
                        borderRadius: pillSize / 2,
                        left: itemWidth / 2 - pillSize / 2,
                        transform: [{ translateX }],
                    },
                ]}
            />
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const focused = state.index === index;
                const Icon = options.tabBarIconComponent;

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
                        style={[styles.tabItem, { width: itemWidth }]}
                        onPress={onPress}
                        hitSlop={8}
                    >
                        <TabIcon focused={focused} Icon={Icon} />
                    </Pressable>
                );
            })}
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <ModernTabBar {...props} />}
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

const styles = StyleSheet.create({
    barContainer: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 10,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        zIndex: 2,
    },
    pillIndicator: {
        position: 'absolute',
        backgroundColor: COLORS.active,
        zIndex: 1,
    },
});