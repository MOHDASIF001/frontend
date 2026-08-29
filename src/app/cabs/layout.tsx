import { API_BASE_URL } from '../../config';

export const revalidate = 60;

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/seo.php?page=cabs.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_keywords,
    };
  } catch (err) {
    return {
      title: "Cab Services - Twin Brothers Holidays",
      description: "Book reliable cab services for your Kashmir travel with Twin Brothers Holidays.",
    };
  }
}

export default function CabsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
