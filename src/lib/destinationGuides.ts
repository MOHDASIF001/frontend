export interface GuidePlace {
  name: string;
  tagline: string;
  description: string;
}

export interface GuideRoute {
  title: string;
  duration: string;
  stops: string;
  description: string;
}

export interface GuideSeason {
  period: string;
  label: string;
  description: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface DestinationGuide {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroSubtitle: string;
  introHeading: string;
  intro: string[];
  placesHeading: string;
  places: GuidePlace[];
  seasonsHeading: string;
  seasons: GuideSeason[];
  routesHeading: string;
  routes: GuideRoute[];
  thingsHeading: string;
  things: string[];
  faqs: GuideFaq[];
}

const rajasthan: DestinationGuide = {
  slug: 'rajasthan',
  name: 'Rajasthan',
  metaTitle: 'Rajasthan Tour Packages: Jaipur, Udaipur, Jaisalmer | Twin Brothers',
  metaDescription:
    'Plan a Rajasthan holiday with Twin Brothers Holidays. Explore Jaipur, Udaipur, Jodhpur and Jaisalmer, the best time to visit, top places and customised Rajasthan tour packages.',
  keywords: [
    'Rajasthan tour packages',
    'Rajasthan holiday packages',
    'Rajasthan trip planner',
    'Jaipur Udaipur Jodhpur Jaisalmer tour',
    'Rajasthan honeymoon packages',
    'Rajasthan family tour packages',
    'Golden Triangle with Rajasthan',
    'best time to visit Rajasthan',
    'Jaisalmer desert safari',
    'Rajasthan tour from Delhi',
    'royal Rajasthan tour',
    'customised Rajasthan itinerary',
    'Twin Brothers Holidays',
  ],
  heroSubtitle: 'Forts, palaces, deserts and lakes — the royal state of India, planned around you.',
  introHeading: 'Why Visit Rajasthan?',
  intro: [
    'Rajasthan is India’s land of kings — a state of hill forts, lake palaces, painted havelis, golden sand dunes and some of the country’s most vibrant food, music and craft traditions. Whether you are planning a first Rajasthan tour or coming back for a different side of it, the state rewards every kind of traveller: history lovers, couples, families, photographers and adventure seekers.',
    'A classic Rajasthan holiday links Jaipur, the Pink City, with Jodhpur, the Blue City, Jaisalmer, the Golden City, and Udaipur, the City of Lakes. Many travellers also add Pushkar, Mount Abu, Bikaner or a wildlife stop at Ranthambore National Park, and start from Delhi as part of a Golden Triangle extension.',
  ],
  placesHeading: 'Top Places to Visit in Rajasthan',
  places: [
    {
      name: 'Jaipur',
      tagline: 'The Pink City',
      description:
        'Amber Fort, City Palace, Hawa Mahal and the Jantar Mantar observatory make Jaipur the natural starting point for any Rajasthan tour, with excellent bazaars for textiles, jewellery and handicrafts.',
    },
    {
      name: 'Udaipur',
      tagline: 'The City of Lakes',
      description:
        'Lake Pichola, the City Palace complex and sunset boat rides give Udaipur its romantic reputation, which is why it is a favourite for honeymoon and couple trips.',
    },
    {
      name: 'Jodhpur',
      tagline: 'The Blue City',
      description:
        'The massive Mehrangarh Fort towers over a maze of blue-washed houses, and Umaid Bhawan Palace adds a royal-heritage stop to the itinerary.',
    },
    {
      name: 'Jaisalmer',
      tagline: 'The Golden City',
      description:
        'A living sandstone fort, ornate havelis and the Sam Sand Dunes for a desert safari and a night under the stars make Jaisalmer the signature desert experience.',
    },
    {
      name: 'Pushkar',
      tagline: 'Sacred Lake Town',
      description:
        'A holy lake, the Brahma Temple and a relaxed old-town atmosphere, famous for the Pushkar Camel Fair held around October–November.',
    },
    {
      name: 'Mount Abu',
      tagline: 'Rajasthan’s Hill Station',
      description:
        'The state’s only hill station, with the Dilwara Jain Temples and Nakki Lake — a cool, green break from the desert circuit.',
    },
    {
      name: 'Ranthambore',
      tagline: 'Tiger Country',
      description:
        'Ranthambore National Park is among the best-known places in India for wildlife safaris and tiger sightings, set around a historic hill fort.',
    },
    {
      name: 'Bikaner & Chittorgarh',
      tagline: 'Fort & Heritage Circuit',
      description:
        'Junagarh Fort in Bikaner and the vast Chittorgarh Fort add depth for travellers who want to go beyond the most popular stops.',
    },
  ],
  seasonsHeading: 'Best Time to Visit Rajasthan',
  seasons: [
    {
      period: 'October to March',
      label: 'Best season',
      description:
        'Pleasant, sunny days and cool evenings make this the ideal window for sightseeing, desert safaris and festivals. It is also the busiest period, so hotels and cabs are best booked early.',
    },
    {
      period: 'April to June',
      label: 'Hot season',
      description:
        'Days are very hot, especially in the desert. Travel is still possible with early-morning sightseeing, and Mount Abu is a cooler option.',
    },
    {
      period: 'July to September',
      label: 'Monsoon season',
      description:
        'Rain brings green hills and full lakes, particularly around Udaipur, with fewer crowds and lower demand. Some outdoor activities can be affected by weather.',
    },
  ],
  routesHeading: 'Suggested Rajasthan Tour Routes',
  routes: [
    {
      title: 'Golden Triangle with Jaipur Extension',
      duration: 'Typically 5–6 days',
      stops: 'Delhi → Agra → Jaipur',
      description:
        'The most popular first-time route, combining the Taj Mahal with Jaipur’s forts and palaces.',
    },
    {
      title: 'Royal Rajasthan Circuit',
      duration: 'Typically 8–10 days',
      stops: 'Jaipur → Jodhpur → Jaisalmer → Udaipur',
      description:
        'A full tour of the forts, the Thar Desert and the lake city — the classic route for a proper Rajasthan holiday.',
    },
    {
      title: 'Wildlife & Heritage',
      duration: 'Typically 6–7 days',
      stops: 'Jaipur → Ranthambore → Pushkar',
      description:
        'A balanced route that pairs city heritage with a tiger safari and a spiritual stop at Pushkar.',
    },
  ],
  thingsHeading: 'Things to Do in Rajasthan',
  things: [
    'Explore the forts and palaces of Jaipur, Jodhpur and Udaipur',
    'Take a camel or jeep safari on the Sam Sand Dunes near Jaisalmer',
    'Enjoy a sunset boat ride on Lake Pichola in Udaipur',
    'Go on a tiger safari at Ranthambore National Park',
    'Shop for block prints, blue pottery, jewellery and leather in Jaipur and Jodhpur',
    'Attend a folk music and dance evening with traditional Rajasthani thali',
    'Visit the Pushkar Camel Fair or the Jaisalmer Desert Festival if your dates allow',
  ],
  faqs: [
    {
      question: 'What is the best time to visit Rajasthan?',
      answer:
        'October to March is the best time to visit Rajasthan, with pleasant weather for sightseeing and desert safaris. Summers (April to June) are very hot, and the monsoon (July to September) is quieter with greener landscapes, especially around Udaipur.',
    },
    {
      question: 'How many days are enough for a Rajasthan tour?',
      answer:
        'Around 5 to 6 days covers Jaipur with a Golden Triangle route, while 8 to 10 days lets you include Jodhpur, Jaisalmer and Udaipur without rushing. Adding Pushkar, Mount Abu or Ranthambore usually means a few extra days.',
    },
    {
      question: 'Is Rajasthan good for a honeymoon or a family holiday?',
      answer:
        'Yes. Udaipur and Jaisalmer are popular for couples because of the lakes, palaces and desert camps, while Jaipur, Ranthambore and Mount Abu work well for families and mixed-age groups.',
    },
    {
      question: 'How do I reach Rajasthan and travel between cities?',
      answer:
        'Jaipur, Udaipur, Jodhpur and Jaisalmer have airports, and the state is well connected by train from Delhi and other major cities. Most travellers move between cities by private cab, which offers the most flexibility for sightseeing stops.',
    },
    {
      question: 'Can Twin Brothers Holidays customise a Rajasthan itinerary?',
      answer:
        'Yes. Share your travel dates, budget and group size through the Customize Package option or our Contact Us page, and our team will build a Rajasthan itinerary around them. You can also book hotels, cabs and activities separately on the website.',
    },
  ],
};

const guides: Record<string, DestinationGuide> = {
  rajasthan,
};

export function getDestinationGuide(slug: string): DestinationGuide | undefined {
  return guides[slug];
}
