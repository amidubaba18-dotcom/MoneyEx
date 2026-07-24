import React, { useRef } from 'react';
import { View, TouchableWithoutFeedback, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

interface QuickActionsProps {
    onAddExpense: () => void;
    onAddIncome: () => void;
}

export function QuickActions({ onAddExpense, onAddIncome }: QuickActionsProps) {
    const expenseScale = useRef(new Animated.Value(1)).current;
    const incomeScale = useRef(new Animated.Value(1)).current;

    const animatePress = (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
            toValue,
            speed: 40,
            bounciness: 6,
            useNativeDriver: true,
        }).start();
    };

    const handleExpense = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onAddExpense();
    };

    const handleIncome = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onAddIncome();
    };

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback
                onPressIn={() => animatePress(expenseScale, 0.95)}
                onPressOut={() => animatePress(expenseScale, 1)}
                onPress={handleExpense}
            >
                <Animated.View style={[styles.button, { transform: [{ scale: expenseScale }] }]}>
                    <View style={styles.iconCircle}>
                        <ArrowUpRight size={18} color="#FFFFFF" />
                    </View>
                    <Text style={styles.buttonText}>Expense</Text>
                </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
                onPressIn={() => animatePress(incomeScale, 0.95)}
                onPressOut={() => animatePress(incomeScale, 1)}
                onPress={handleIncome}
            >
                <Animated.View style={[styles.button, { transform: [{ scale: incomeScale }] }]}>
                    <View style={styles.iconCircle}>
                        <ArrowDownLeft size={18} color="#FFFFFF" />
                    </View>
                    <Text style={styles.buttonText}>Income</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 16,
        gap: 12,
    },
    button: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#16181D',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
    },
});