import { API_BASE_URL, resolveAssetUrl } from '../config';

export interface PromoSlide {
  title: string;
  image: string;
  image_alt?: string | null;
  imageMobile?: string | null;
  link?: string | null;
}

interface PromoSlideRow {
  title?: string;
  image: string;
  image_alt?: string;
  image_mobile?: string;
  button_link?: string;
}

// Server-side counterpart of the fetch HolidaysPromoSlider otherwise does client-side
// on mount, so the slider's hero image is already in the server-rendered HTML.
export async function fetchPromoSlides(position: string): Promise<PromoSlide[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/sliders.php?position=${position}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'success' || !Array.isArray(data.data)) return [];
    return (data.data as PromoSlideRow[]).map((s) => ({
      title: s.title || 'Special Offer',
      image_alt: s.image_alt || null,
      image: resolveAssetUrl(s.image),
      imageMobile: s.image_mobile ? resolveAssetUrl(s.image_mobile) : null,
      link: s.button_link || null,
    }));
  } catch (err) {
    console.error('Error fetching promo slides:', err);
    return [];
  }
}
