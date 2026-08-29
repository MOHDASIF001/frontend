import { DestinationItem } from '../types/explore-world';

export const DESTINATIONS_DATA: DestinationItem[] = [
  {
    id: 'domestic',
    type: 'domestic',
    title: 'Domestic',
    subtitle: 'Explore Incredible India',
    description:
      'Explore incredible destinations within your own country. From mountains to beaches, adventures are endless.',
    imageSrc: '/images/explore-domestic.jpg',
    imageAlt: 'Indian Himalayan mountain range with lush green terrace valley and river stream',
    themeColor: 'orange',
    primaryColorHex: '#FF6500',
    borderColorHex: '#FF6500',
    buttonColorHex: '#FF6500',
    iconName: 'mountain',
    linkUrl: '/destinations',
  },
  {
    id: 'international',
    type: 'international',
    title: 'International',
    subtitle: 'Discover Global Wonders',
    description:
      'Discover breathtaking places around the world and experience different cultures.',
    imageSrc: '/images/explore-international.jpg',
    imageAlt: 'Luxury international Dubai coastal resort with turquoise sea and airplane',
    themeColor: 'navy',
    primaryColorHex: '#082663',
    borderColorHex: '#082663',
    buttonColorHex: '#082663',
    iconName: 'globe',
    linkUrl: '/destinations?dest=dubai',
  },
];
