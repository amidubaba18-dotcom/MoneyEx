// ---------------------------------------------------------------------------
// Centralized color tokens for MoneyEx.
// Used by theme/index.ts to provide dynamic colors based on isDark.
// ---------------------------------------------------------------------------

export const lightColors = {
    // Surfaces
    bg: '#F5F7FA',
    surface: '#FFFFFF',
    surfaceElevated: '#F8FAFC',

    // Text
    textPrimary: '#0F172A',
    textSecondary: '#1E293B',
    textMuted: '#64748B',

    // UI Elements
    accent: '#0F172A',
    accentInverse: '#FFFFFF',
    hairline: 'rgba(0,0,0,0.06)',
    border: '#E2E8F0',

    // Feedback
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',

    // Tab Bar (matches your requested COLORS)
    tabSurface: '#FFFFFF',
    tabBorder: '#E8E8E8',
    tabActive: '#0F172A',
    tabActiveIcon: '#0F172A',
    tabInactiveIcon: '#94A3B8',
    tabLabelActive: '#0F172A',
    tabLabelInactive: '#94A3B8',
};

export const darkColors = {
    // Surfaces
    bg: '#1A1A1A',
    surface: '#121212',
    surfaceElevated: '#242424',

    // Text
    textPrimary: '#F2F2F0',
    textSecondary: '#D4D4D0',
    textMuted: '#8A8A87',

    // UI Elements
    accent: '#F2F2F0',
    accentInverse: '#1A1A1A',
    hairline: 'rgba(242,242,240,0.08)',
    border: 'rgba(242,242,240,0.1)',

    // Feedback
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',

    // Tab Bar (matches your requested COLORS)
    tabSurface: '#1A1A1A',
    tabBorder: 'rgba(242,242,240,0.08)',
    tabActive: '#F2F2F0',
    tabActiveIcon: '#F2F2F0',
    tabInactiveIcon: '#8A8A87',
    tabLabelActive: '#F2F2F0',
    tabLabelInactive: '#8A8A87',
};
