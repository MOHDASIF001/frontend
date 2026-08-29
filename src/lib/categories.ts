// Package categories are admin-controlled (admin/packages/categories.php ->
// api/categories.php) so anyone on the team can add/rename/remove a category
// without touching code. This file just slugifies the DB `name` for SEO
// URLs (/holidays/{slug}-packages) and supplies a fallback image for
// categories that don't have one of their own.

export interface Category {
  id: number;
  name: string;
}

export function slugifyCategory(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const categoryImages: Record<string, string> = {
  honeymoon: '/images/couple-1.jpeg',
  family: '/images/family-1.jpg',
  luxury: '/images/destination-kashmir.jpg',
  adventure: '/images/shikara-ride.jpg',
  trekking: '/images/destinetion-ladhak.jpg',
  pilgrimage: '/images/destination-pahalgam.jpg',
  religious: '/images/destination-pahalgam.jpg',
  winter: '/images/gulmarg_main.png',
  budget: '/images/srinagar_main.png',
  group: '/images/family-1.jpg',
  solo: '/images/shikara-ride.jpg',
};

const defaultCategoryImage = '/images/default-dest.jpg';

export function getCategoryImage(name: string): string {
  return categoryImages[slugifyCategory(name)] || defaultCategoryImage;
}
