export type ThemeColor = 'orange' | 'navy';

export interface DestinationItem {
  id: string;
  type: 'domestic' | 'international';
  title: string;
  subtitle?: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  themeColor: ThemeColor;
  primaryColorHex: string;
  borderColorHex: string;
  buttonColorHex: string;
  iconName: 'mountain' | 'globe';
  linkUrl: string;
}
