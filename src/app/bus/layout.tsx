import { API_BASE_URL } from '../../config';

export const revalidate = 60;

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/seo.php?page=bus.php`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_keywords,
    };
  } catch (err) {
    return {
      title: "Book Bus Tickets Online - Twin Brothers Holidays",
      description: "Book bus tickets online for your Kashmir travel with Twin Brothers Holidays.",
    };
  }
}

export default function BusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
