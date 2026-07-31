import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Plus, Trash2 } from 'lucide-react-native';
import { useAllCategories, useCategoryStore } from '../../store/useCategoryStore';
import { ICON_LIBRARY, getIcon } from '../../utils/categoryIcons';

const SWATCHES = [
    '#EF4444', '#F59E0B', '#22C55E', '#14B8A6', '#3B82F6', '#6366F1',
    '#8B5CF6', '#EC4899', '#F97316', '#06B6D4', '#F43F5E', '#84CC16',
];

const COLORS = {
    bg: '#1A1A1A',
    textPrimary: '#F2F2F0',
    textMuted: '#8A8A87',
    hairline: 'rgba(242,242,240,0.08)',
    accent: '#F2F2F0',
};

export default function CategoriesScreen() {
    const router = useRouter();
    const categories = useAllCategories();
    const addCategory = useCategoryStore((s) => s.addCategory);
    const removeCategory = useCategoryStore((s) => s.removeCategory);

    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('Circle');
    const [selectedColor, setSelectedColor] = useState(SWATCHES[0]);

    const iconNames = Object.keys(ICON_LIBRARY);

    const handleSave = () => {
        if (!name.trim()) return;
        addCategory({ name: name.trim(), icon: selectedIcon, color: selectedColor });
        setName('');
        setSelectedIcon('Circle');
        setSelectedColor(SWATCHES[0]);
        setIsAdding(false);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bg }]} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: COLORS.textPrimary }]}>Categories</Text>
                <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
                    <X size={22} color={COLORS.textPrimary} strokeWidth={2.25} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {categories.map((cat) => {
                        const Icon = getIcon(cat.icon);
                        return (
                            <View key={cat.id} style={styles.gridItem}>
                                <View style={[styles.badge, { backgroundColor: `${cat.color}26` }]}>
                                    <Icon size={20} color={cat.color} strokeWidth={2.25} />
                                </View>
                                <Text style={[styles.gridLabel, { color: COLORS.textPrimary }]} numberOfLines={1}>
                                    {cat.name}
                                </Text>
                                {cat.isCustom && (
                                    <TouchableOpacity
                                        onPress={() => removeCategory(cat.id)}
                                        hitSlop={8}
                                        style={styles.deleteBtn}
                                    >
                                        <Trash2 size={12} color={COLORS.textMuted} strokeWidth={2} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}

                    <TouchableOpacity style={styles.gridItem} onPress={() => setIsAdding(true)} activeOpacity={0.7}>
                        <View style={[styles.badge, styles.addBadge]}>
                            <Plus size={20} color={COLORS.textMuted} strokeWidth={2.25} />
                        </View>
                        <Text style={[styles.gridLabel, { color: COLORS.textPrimary }]}>Add new</Text>
                    </TouchableOpacity>
                </View>

                {isAdding && (
                    <View style={[styles.addPanel, { borderTopColor: COLORS.hairline }]}>
                        <Text style={[styles.sectionTitle, { color: COLORS.textMuted }]}>New category</Text>
                        <TextInput
                            style={[styles.nameInput, { color: COLORS.textPrimary, borderColor: COLORS.hairline }]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Category name"
                            placeholderTextColor={COLORS.textMuted}
                        />

                        <Text style={[styles.sectionTitle, { color: COLORS.textMuted }]}>Icon</Text>
                        <View style={styles.iconGrid}>
                            {iconNames.map((iconName) => {
                                const Icon = ICON_LIBRARY[iconName];
                                const isSelected = iconName === selectedIcon;
                                return (
                                    <TouchableOpacity
                                        key={iconName}
                                        style={[
                                            styles.iconOption,
                                            isSelected && styles.iconOptionSelected,
                                            { borderColor: isSelected ? COLORS.accent : 'transparent' },
                                        ]}
                                        onPress={() => setSelectedIcon(iconName)}
                                    >
                                        <Icon size={18} color={isSelected ? selectedColor : COLORS.textMuted} strokeWidth={2.25} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={[styles.sectionTitle, { color: COLORS.textMuted }]}>Color</Text>
                        <View style={styles.swatchRow}>
                            {SWATCHES.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[
                                        styles.swatch,
                                        { backgroundColor: c },
                                        selectedColor === c && styles.swatchSelected,
                                        selectedColor === c && { borderColor: COLORS.textPrimary },
                                    ]}
                                    onPress={() => setSelectedColor(c)}
                                />
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: COLORS.accent }]}
                            onPress={handleSave}
                            activeOpacity={0.85}
                        >
                            <Text style={[styles.saveButtonText, { color: COLORS.bg }]}>Save category</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: '700' },
    scrollContent: { paddingBottom: 40 },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    gridItem: { width: '22%', alignItems: 'center', gap: 6 },
    badge: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    addBadge: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    gridLabel: { fontSize: 11, textAlign: 'center' },
    deleteBtn: { position: 'absolute', top: -4, right: 4 },

    addPanel: { marginTop: 32, borderTopWidth: 1, paddingTop: 24 },
    sectionTitle: {
        fontSize: 12, fontWeight: '600',
        textTransform: 'uppercase', letterSpacing: 0.5,
        marginBottom: 10, marginTop: 16,
    },
    nameInput: {
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },

    iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    iconOption: {
        width: 40, height: 40, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    iconOptionSelected: { borderColor: '#F2F2F0' },

    swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    swatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
    swatchSelected: { borderWidth: 2 },

    saveButton: { marginTop: 24, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
    saveButtonText: { fontSize: 16, fontWeight: '700' },
});