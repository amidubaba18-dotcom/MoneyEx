import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Icons from 'lucide-react-native';
import { useTheme } from 'react-native-paper';
import { CategoryRepository } from '../repositories/CategoryRepository';

const categoryRepo = new CategoryRepository();

interface CategoryPickerProps {
    type: 'income' | 'expense';
    selectedCategoryId: string | null;
    onSelect: (id: string) => void;
}

export function CategoryPicker({ type, selectedCategoryId, onSelect }: CategoryPickerProps) {
    const theme = useTheme();
    const [categories, setCategories] = useState<Array<{ id: number; name: string; icon: string; color: string }>>([]);

    useEffect(() => {
        categoryRepo.getByType(type).then(setCategories).catch(console.error);
    }, [type]);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {categories.map((cat) => {
                const IconComponent = (Icons as any)[cat.icon] || Icons.Circle;
                const isSelected = selectedCategoryId === cat.id.toString();
                return (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.item, isSelected && { backgroundColor: cat.color + '20' }]}
                        onPress={() => onSelect(cat.id.toString())}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: cat.color }]}>
                            <IconComponent size={24} color="white" />
                        </View>
                        <Text style={[styles.label, { color: theme.colors.onSurface }]} numberOfLines={1}>
                            {cat.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 24, maxHeight: 100 },
    item: { alignItems: 'center', marginRight: 16, padding: 8, borderRadius: 12 },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    label: { fontSize: 12, textAlign: 'center' },
});