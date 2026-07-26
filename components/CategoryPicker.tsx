import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as Icons from 'lucide-react-native';
import { CategoryRepository } from '../repositories/CategoryRepository';

const categoryRepo = new CategoryRepository();

export interface Category {
    id: number;
    name: string;
    icon: string;
    color: string;
}

interface CategoryPickerProps {
    type: 'income' | 'expense';
    selectedCategory: Category | null;
    onSelect: (category: Category) => void;
}

export function CategoryPicker({ type, selectedCategory, onSelect }: CategoryPickerProps) {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        categoryRepo.getByType(type).then(setCategories).catch(console.error);
    }, [type]);

    return (
        <BottomSheetScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {categories.map((cat) => {
                const IconComponent = (Icons as any)[cat.icon] || Icons.Circle;
                const isSelected = selectedCategory?.id === cat.id;
                return (
                    <TouchableOpacity
                        key={cat.id}
                        style={styles.item}
                        onPress={() => onSelect(cat)}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.iconCircle,
                                { backgroundColor: cat.color },
                                isSelected && styles.iconCircleSelected,
                            ]}
                        >
                            <IconComponent size={20} color="white" strokeWidth={2.5} />
                        </View>
                        <Text
                            style={[styles.label, isSelected && styles.labelSelected]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                        >
                            {cat.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </BottomSheetScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 8,
        paddingRight: 8,
        gap: 4,
    },
    item: {
        alignItems: 'center',
        marginRight: 14,
        width: 68,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    iconCircleSelected: {
        borderColor: '#0F172A',
        borderWidth: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        color: '#94A3B8',
        textAlign: 'center',
        maxWidth: 68,
    },
    labelSelected: {
        color: '#0F172A',
        fontWeight: '700',
    },
});

export default CategoryPicker;
