import { API_BASE_URL } from '../config';

export interface Faq {
  question: string;
  answer: string;
}

interface FaqRow {
  question: string;
  answer: string;
}

async function fetchFaqsInternal(url: string): Promise<Faq[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'success' || !Array.isArray(data.data)) return [];
    return (data.data as FaqRow[])
      .filter((f) => f.question && f.answer)
      .map((f) => ({ question: f.question, answer: f.answer }));
  } catch (err) {
    console.error('Error fetching FAQs:', err);
    return [];
  }
}

export function fetchHomeFaqs(): Promise<Faq[]> {
  return fetchFaqsInternal(`${API_BASE_URL}/faqs.php?scope=home`);
}

export function fetchPackageFaqs(packageId: number | string): Promise<Faq[]> {
  return fetchFaqsInternal(`${API_BASE_URL}/faqs.php?scope=package&package_id=${encodeURIComponent(String(packageId))}`);
}
