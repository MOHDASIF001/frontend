import { API_BASE_URL } from '../../config';

export const revalidate = 3600;

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/seo.php?page=activities.php`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      title: data.meta_title,
      description: data.meta_description,
      keywords: data.meta_keywords,
    };
  } catch (err) {
    return {
      title: "Activities - Twin Brothers Holidays",
      description: "Discover exciting adventure activities and experiences with Twin Brothers Holidays.",
    };
  }
}

export default function ActivitiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
