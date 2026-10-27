import type { Faq } from './faqs';
import { majorDestinations } from './majorDestinations';

// Destinations that currently have group tour packages (and a /group-tours/{slug} page worth linking to).
export const GROUP_TOUR_SLUGS = ['kashmir', 'ladakh', 'himachal', 'kerala', 'goa', 'rajasthan', 'dubai'];

export interface GroupTourPageSeo {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { heading: string; paragraphs?: string[]; points?: string[] }[];
  faqs: Faq[];
}

// Copy supplied by the SEO team (Deenx Consultancy task sheet, 27/10/2026), targeting
// "group tours to himachal pradesh". Other destinations fall back to the generic page.
export const groupTourPageSeo: Record<string, GroupTourPageSeo> = {
  himachal: {
    title: 'Group Tours to Himachal Pradesh | Shimla Manali Packages',
    description:
      'Book group tours to Himachal Pradesh with fixed departures, hotels, sightseeing and a tour manager. Shimla, Manali & Kullu trips. Get a free quote today.',
    h1: 'Group Tours to Himachal Pradesh',
    intro:
      'Planning group tours to Himachal Pradesh? Twin Brothers Holidays runs handpicked, fully managed group tours to Shimla, Manali and Kullu with fixed departures, comfortable stays, all sightseeing and a dedicated tour manager. Perfect for friends, families and solo travellers who want to explore Himachal together at a budget-friendly price.',
    sections: [
      {
        heading: 'Why Choose Group Tours to Himachal Pradesh?',
        paragraphs: [
          'Group tours to Himachal Pradesh are one of the easiest and most affordable ways to see Shimla, Manali and Kullu. Transport, stays and sightseeing are shared, so the cost per person stays low.',
          'You travel on fixed dates with a dedicated tour manager, so there is no stress about cabs, hotels or routes. It is a good fit for friends, families and solo travellers who want a safe, social and well-planned mountain trip.',
        ],
      },
      {
        heading: 'Places Covered in Our Himachal Group Tours',
        points: [
          'Shimla: The Ridge, Mall Road and Christ Church.',
          'Kufri: snow fun, horse rides and viewpoints.',
          'Kullu: the Beas river, river rafting and local markets.',
          'Manali: Hadimba Temple, Old Manali cafes and Mall Road.',
          'Solang Valley: paragliding, zorbing and snow activities.',
          'Rohtang Pass area: snow views, subject to permit and weather.',
        ],
      },
      {
        heading: 'Best Time for Himachal Group Tours',
        paragraphs: [
          'October to February is best for snow and winter fun. March to June brings pleasant weather and green valleys, ideal for sightseeing and adventure.',
          'July to September is the monsoon, when some routes can face delays, so plan with flexibility. Fixed-departure dates fill quickly, so book early.',
        ],
      },
      {
        heading: 'What Is Included in Our Himachal Group Tour Packages',
        points: [
          'Fixed departures with handpicked groups',
          'Comfortable hotel stays',
          'Sightseeing by private cab',
          'A dedicated tour manager throughout the trip',
          'Transfers and 24/7 trip support',
        ],
        paragraphs: ['Exact inclusions and exclusions are listed on each package page.'],
      },
      {
        heading: 'Popular Himachal Group Tour Packages',
        paragraphs: [
          'We offer Himachal group tour packages such as Manali and Kullu (7 Days 6 Nights), Shimla Manali (6 Days 5 Nights) and Shimla Manali Kullu (8 Days 7 Nights). Each plan can be customised using the Customize Package option or by talking to a travel expert.',
          'Whether you are looking for a Shimla Manali group tour, a Manali group tour package or a Himachal tour package for groups, our fixed departure tours make it easy to travel together.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the best group tour to Himachal Pradesh?',
        answer:
          'The best group tour depends on your time and interests. A Shimla Manali Kullu plan covers the main hill stations, while a Manali and Kullu plan suits snow and adventure lovers. Our travel experts can help you choose.',
      },
      {
        question: 'Are group tours to Himachal Pradesh safe for solo travellers and women?',
        answer:
          'Yes. A dedicated tour manager stays with the group throughout the trip, and stays are comfortable and verified, which makes group tours a good option for solo travellers and women.',
      },
      {
        question: 'How many days are enough for a Himachal group tour?',
        answer: 'Six to eight days is ideal to cover Shimla, Manali and Kullu comfortably without rushing.',
      },
      {
        question: 'What is included in a Himachal group tour package?',
        answer:
          'Packages include comfortable hotel stays, sightseeing by private cab, a dedicated tour manager and 24/7 support. Check the package page for exact inclusions and exclusions.',
      },
      {
        question: 'What is the best time for a Himachal group tour?',
        answer:
          'October to February is best for snow, and March to June is ideal for pleasant weather. Monsoon months can bring route delays.',
      },
      {
        question: 'Can I customise a Himachal group tour?',
        answer:
          'Yes. You can change the duration, hotels and activities using the Customize Package option or by speaking to a travel expert.',
      },
    ],
  },
};

// Anchor text for links pointing at a destination's group tour page - varied per
// placement so every link isn't the same exact-match phrase.
export function groupTourLinkLabel(slug: string, placement: 'footer' | 'destination' | 'package'): string {
  const label = majorDestinations.find((d) => d.slug === slug)?.label || slug;
  if (slug === 'himachal') {
    return { footer: 'Group Tours to Himachal Pradesh', destination: 'Himachal group tour packages', package: 'Shimla Manali group tour' }[placement];
  }
  return placement === 'destination' ? `${label} group tour packages` : `${label} group tours`;
}

/** The group tour destination a package belongs to, if it is a group package in one of GROUP_TOUR_SLUGS. */
export function groupTourSlugForPackage(pkg: { category?: string | null; location_name?: string | null }): string | undefined {
  if ((pkg.category || '').trim().toLowerCase() !== 'group') return undefined;
  const loc = (pkg.location_name || '').toLowerCase();
  return majorDestinations.find((d) => GROUP_TOUR_SLUGS.includes(d.slug) && d.matchCities.some((c) => loc.includes(c)))?.slug;
}
