import {
    Utensils, ShoppingBag, Car, ShoppingCart, FileText, Film, Heart, Plane, Home,
    BookOpen, User, Circle, Coffee, Smartphone, PawPrint, Wallet, Gift, Lightbulb,
    GraduationCap, HeartPulse, Dumbbell, Music, Wifi, Fuel, Baby, Shirt, Wrench,
    LucideIcon,
} from 'lucide-react-native';

// Broad-enough icon set to cover most personal expense categories. Add more
// lucide icons here as needed — every entry becomes selectable in the
// category manager's icon grid.
export const ICON_LIBRARY: Record<string, LucideIcon> = {
    Utensils, ShoppingBag, Car, ShoppingCart, FileText, Film, Heart, Plane, Home,
    BookOpen, User, Circle, Coffee, Smartphone, PawPrint, Wallet, Gift, Lightbulb,
    GraduationCap, HeartPulse, Dumbbell, Music, Wifi, Fuel, Baby, Shirt, Wrench,
};

export const getIcon = (name?: string): LucideIcon => ICON_LIBRARY[name ?? ''] ?? Circle;
