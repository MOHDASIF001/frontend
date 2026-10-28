import type { SeoContent } from '../components/SeoContentSection';
import type { Faq } from './faqs';

// Keyword-targeted copy for the /holidays/{destination} listing pages. Every text can use
// these placeholders, filled from the live package list so prices and counts never go stale:
//   {year} {count} {min_price} {min_nights} {max_nights}
// The same placeholders work in Admin Panel -> Page SEO Content (path /holidays/{slug}),
// which overrides anything set here.
export interface HolidayDestinationSeo {
  title: string;
  description: string;
  h1: string;
  intro: string;
  content: SeoContent;
  faqs: Faq[];
}

export interface DestinationStats {
  count: number;
  minPrice: number;
  minNights: number;
  maxNights: number;
}

export function fillSeoTokens(text: string, stats: DestinationStats): string {
  return text
    .replace(/\{year\}/g, String(new Date().getFullYear()))
    .replace(/\{count\}/g, String(stats.count))
    .replace(/\{min_price\}/g, stats.minPrice > 0 ? `₹${stats.minPrice.toLocaleString('en-IN')}` : '')
    .replace(/\{min_nights\}/g, String(stats.minNights))
    .replace(/\{max_nights\}/g, String(stats.maxNights));
}

export const holidayDestinationSeo: Record<string, HolidayDestinationSeo> = {
  kashmir: {
    title: 'Best Kashmir Tour Packages {year} | From {min_price}',
    description:
      'Compare {count} Kashmir tour packages covering Srinagar, Gulmarg, Pahalgam and Sonamarg - {min_nights} to {max_nights} nights, from {min_price} per person. Family, honeymoon and group trips.',
    h1: 'Best Kashmir Tour Packages {year}',
    intro:
      'Our Kashmir tour packages cover Srinagar, Gulmarg, Pahalgam and Sonamarg in {min_nights} to {max_nights} nights, starting from {min_price} per person. Choose a short break, a family holiday, a honeymoon, a group tour or a complete Kashmir circuit - every package lists its hotels, transfers and sightseeing before you book, so you can compare them side by side. Spend a night on a Dal Lake houseboat, ride the Gulmarg Gondola, walk through Betaab and Aru valleys in Pahalgam and drive up to Thajiwas Glacier in Sonamarg. If none of the ready-made trips fits your dates or budget, our team will build a custom Kashmir itinerary for you.',
    content: {
      heading: 'How to Choose the Best Kashmir Tour Package',
      paragraphs: [
        'The right Kashmir package depends less on the lowest price and more on your travel month, the number of days you have and where you want to stay. A trip that rushes through four destinations in four days spends most of its time on the road, while one extra night lets you actually enjoy Gulmarg or Pahalgam. Use the filters above to sort by price, duration and package type, then open a package to see its day-wise itinerary, hotels and inclusions.',
      ],
      subsections: [
        {
          heading: 'How many days are enough for Kashmir?',
          points: [
            '3 nights / 4 days: Srinagar with a day trip to Gulmarg or Sonamarg - good for a first, short visit.',
            '4 nights / 5 days: Srinagar, Gulmarg and Pahalgam - the most popular first-time Kashmir itinerary.',
            '5 nights / 6 days: adds Sonamarg and a slower pace, with a night on a Dal Lake houseboat.',
            '7 nights and above: the complete Kashmir circuit, with time for Doodhpathri, Yusmarg or extra days in the snow.',
          ],
        },
        {
          heading: 'Best time to visit Kashmir',
          points: [
            'March to May (spring): almond blossom and the Tulip Garden in Srinagar, pleasant days and green meadows.',
            'June to August (summer): the busiest season, ideal for Sonamarg, Pahalgam and Thajiwas Glacier.',
            'September to November (autumn): golden chinar trees, clear skies and fewer crowds.',
            'December to February (winter): snowfall in Gulmarg and Pahalgam, skiing and the Gondola above the clouds.',
          ],
        },
        {
          heading: 'Places covered in our Kashmir packages',
          points: [
            'Srinagar: Dal Lake shikara ride, houseboats, Mughal Gardens and the old city.',
            'Gulmarg: Gulmarg Gondola, snow activities in winter and meadows in summer.',
            'Pahalgam: Betaab Valley, Aru Valley, Chandanwari and the Lidder river.',
            'Sonamarg: Thajiwas Glacier and the Sindh valley on the road towards Ladakh.',
          ],
        },
        {
          heading: 'Kashmir packages for every kind of traveller',
          paragraphs: [
            'Couples can pick from our honeymoon packages with houseboat stays, families from shorter trips with easy sightseeing, and friends or solo travellers can join a fixed-departure Kashmir group tour to share the cost. Each package page shows exactly what is included and what is not, so there are no surprises at the end.',
          ],
        },
      ],
    },
    faqs: [
      {
        question: 'What is the price of a Kashmir tour package?',
        answer:
          'Our Kashmir tour packages currently start from {min_price} per person. The final price depends on the number of nights, the hotel category, the travel month and the number of travellers. Every package page shows its price and inclusions before you book.',
      },
      {
        question: 'Which is the best Kashmir tour package for first-time visitors?',
        answer:
          'A 4 nights / 5 days or 5 nights / 6 days package covering Srinagar, Gulmarg and Pahalgam works best for most first-time visitors. Add Sonamarg if you have one more day.',
      },
      {
        question: 'What is the best time to book a Kashmir trip?',
        answer:
          'April to June and September to October are the most popular months for sightseeing, while December to February is best for snow. Book 3 to 4 weeks ahead for peak season and holidays, when hotels and houseboats fill up quickly.',
      },
      {
        question: 'Do you have Kashmir packages for families and honeymoon couples?',
        answer:
          'Yes. Use the Package Type filter on this page to see family, honeymoon, adventure and group tour packages for Kashmir. Each one lists its hotels, transfers and sightseeing.',
      },
      {
        question: 'Can I customize a Kashmir tour package?',
        answer:
          'Yes. Tell us your travel dates, budget and the places you want to see, and our team will change the hotels, number of nights or sightseeing to build a custom Kashmir itinerary for you.',
      },
      {
        question: 'Do you run Kashmir group tours?',
        answer:
          'Yes. Our Kashmir group tours run on fixed departure dates at a shared group price. See the Kashmir group tours page for the current departures.',
      },
    ],
  },
};
