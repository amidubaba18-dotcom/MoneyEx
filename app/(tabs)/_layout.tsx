import React from 'react';
import { Tabs } from 'expo-router';
import { Home, BarChart3, Wallet, User } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabItem,
                swipeEnabled: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <Home size={20} color={focused ? '#FFFFFF' : '#9CA3AF'} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="budget"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <BarChart3 size={20} color={focused ? '#FFFFFF' : '#9CA3AF'} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <Wallet size={20} color={focused ? '#FFFFFF' : '#9CA3AF'} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                            <User size={20} color={focused ? '#FFFFFF' : '#9CA3AF'} />
                        </View>
                    ),
                }}
            />
            {/* Not shown in the tab bar, still reachable via router.push */}
            <Tabs.Screen name="notifications" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 20,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
    },
    tabItem: {
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapActive: {
        backgroundColor: '#111827',
    },
});