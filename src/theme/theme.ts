import { Platform } from 'react-native';
import type { ThemeMode } from '@/types/models';

export const palette = {
  ink: '#102131', paper: '#F5F7F4', white: '#FFFFFF', mint: '#BFEAD7', teal: '#147D72', blue: '#3E78E7', gold: '#D69A3A', red: '#C95655', mist: '#DDE7E4', muted: '#64757D', night: '#101722', nightCard: '#182330', nightLine: '#293744', nightText: '#E8F1EE'
};
export const colorsFor = (dark: boolean) => dark ? { background: palette.night, surface: palette.nightCard, text: palette.nightText, subtext: '#9DB0B1', line: palette.nightLine, accent: palette.mint, accentText: palette.ink, blue: '#8AAFFF', success: '#76D5AE', warning: '#E6B65E', danger: '#E7837D' } : { background: palette.paper, surface: palette.white, text: palette.ink, subtext: palette.muted, line: palette.mist, accent: palette.teal, accentText: palette.white, blue: palette.blue, success: palette.teal, warning: palette.gold, danger: palette.red };
export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 };
export const fonts = { regular: Platform.select({ android: 'sans-serif', default: undefined }), medium: Platform.select({ android: 'sans-serif-medium', default: undefined }) };
export type AppColors = ReturnType<typeof colorsFor>;
export type { ThemeMode };
