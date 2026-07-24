import React, { useRef } from 'react';
import { Animated, View, Text, StyleSheet, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { useTransactionStore } from '../store/useTransactionStore';

export function SwipeableRow({ children, transactionId }: { children: React.ReactNode; transactionId: string }) {
    const swipeableRef = useRef<Swipeable>(null);
    const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);

    const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [64, 0],
        });
        return (
            <Animated.View style={[styles.deleteBox, { transform: [{ translateX: trans }] }]}>
                <Text style={styles.deleteText}>Delete</Text>
            </Animated.View>
        );
    };

    const handleSwipeOpen = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    };

    const handleDelete = () => {
        deleteTransaction(transactionId);
    };

    if (Platform.OS === 'web' || !Swipeable) {
        return <View style={styles.webContainer}>{children}</View>;
    }

    return (
        <Swipeable
            ref={swipeableRef}
            friction={2}
            rightThreshold={40}
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={handleSwipeOpen}
            onSwipeableOpen={handleDelete}
        >
            {children}
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    webContainer: {
        width: '100%',
    },
    deleteBox: {
        backgroundColor: '#ff3b30',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        flex: 1,
        borderRadius: 20,
        marginBottom: 12,
    },
    deleteText: {
        color: 'white',
        fontWeight: '800',
    },
});