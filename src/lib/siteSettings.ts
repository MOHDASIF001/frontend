import { API_BASE_URL } from '../config';

export interface SiteSettings {
  site_title: string;
  site_email: string;
  site_phone: string;
  site_address: string;
  site_logo: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
  gtm_container_id: string;
  ga4_measurement_id: string;
  robots_txt: string;
}

const EMPTY: SiteSettings = {
  site_title: '', site_email: '', site_phone: '', site_address: '', site_logo: '',
  facebook_url: '', instagram_url: '', twitter_url: '', linkedin_url: '',
  gtm_container_id: '', ga4_measurement_id: '', robots_txt: '',
};

// Admin Panel -> Settings -> "SEO & Integrations" / "Site Information" / "Social Media
// Links" all write to this one endpoint, so GTM/GA, robots.txt and the sitewide
// Organization schema stay in sync with whatever the admin last saved - no redeploy needed.
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings.php`, { next: { revalidate: 300 } });
    if (!res.ok) return EMPTY;
    const data = await res.json();
    if (data.status !== 'success' || !data.data) return EMPTY;
    return { ...EMPTY, ...data.data };
  } catch (err) {
    console.error('Error fetching site settings:', err);
    return EMPTY;
  }
}
