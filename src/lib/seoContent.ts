import type { SeoContent } from '../components/SeoContentSection';

// Written travel-guide copy for pages that were flagged as thin content. Keep it to
// well-established facts about each place - no prices, ratings or claims about the
// business that the admin panel doesn't already back up.

/* ---------------------------------- Cabs ---------------------------------- */

const cabIntro: Record<string, string[]> = {
  srinagar: [
    'Srinagar, the summer capital of Jammu and Kashmir, is where most Kashmir trips begin and end. A cab is the easiest way to move between the Dal Lake ghats, the Mughal Gardens of Nishat, Shalimar and Chashme Shahi, the old city markets and hotels spread across the city and its outskirts.',
    'Most travellers base themselves in Srinagar and take day trips from here. Gulmarg, Sonamarg and Doodhpathri each make a comfortable day out by road, while Pahalgam is usually done as an overnight trip. Booking one cab for the whole day means your driver waits while you sightsee, so you are not looking for transport at every stop.',
  ],
  'srinagar-airport': [
    "Srinagar's airport (SXR), officially Sheikh ul-Alam International Airport, is the main entry point for visitors flying into the Kashmir Valley. It sits about 12 km from the city centre, and the drive to the Dal Lake area usually takes 30 to 45 minutes depending on traffic.",
    'A pre-booked airport cab means a driver is ready when you land, which helps because the airport has additional security checks and the arrivals area can be busy. It works the other way too: schedule a pickup from your hotel or houseboat with enough time for screening before your flight, or travel straight on to Gulmarg, Pahalgam or Sonamarg if you are not staying in Srinagar first.',
  ],
  gulmarg: [
    'Gulmarg is a hill resort in the Baramulla district, roughly 50 km from Srinagar, known for its wide meadows, the Gulmarg Gondola and winter skiing on the slopes of Mount Apharwat. The drive from Srinagar takes around one and a half to two hours via Tangmarg, with the last stretch climbing through pine forest.',
    'Most visitors do Gulmarg as a day trip from Srinagar, though staying a night lets you reach the Gondola early before the queues build. In winter the road above Tangmarg can need snow chains after heavy snowfall, so an SUV is the safer choice between December and March.',
  ],
  sonamarg: [
    "Sonamarg, the 'meadow of gold', lies in the Ganderbal district about 80 km from Srinagar on the Srinagar-Leh highway. It is the base for the Thajiwas Glacier, riverside views along the Sindh, and the drive onward over Zoji La to Ladakh.",
    'The road from Srinagar follows the Sindh valley through Kangan and takes around two and a half to three hours. Sonamarg works well as a day trip, and it is also a useful overnight stop if you are continuing to Kargil and Leh by road. Snow usually closes the route beyond Sonamarg in winter, so check conditions before planning travel in those months.',
  ],
  pahalgam: [
    "Pahalgam sits in the Lidder valley in the Anantnag district, about 90 km from Srinagar, and is one of Kashmir's most visited hill towns. It is the starting point for Betaab Valley, Aru Valley and Chandanwari, and the base for the Amarnath Yatra route that begins at Chandanwari.",
    'The drive from Srinagar takes roughly two and a half to three hours, passing the saffron fields of Pampore and the ancient Awantipora temple ruins. Sightseeing points around Pahalgam are generally served by the local taxi stand, so outside vehicles often drop you in town for that part of the day. Ask our team when you book and we will plan the day accordingly.',
  ],
  'aru-valley': [
    'Aru Valley is a meadow village about 12 km from Pahalgam along the Aru river, surrounded by pine forest and snow-capped peaks. It is a popular half-day outing from Pahalgam and the starting point for treks to the Kolahoi Glacier and Tarsar Lake.',
    'Most travellers reach Aru from Pahalgam town; from Srinagar the full journey takes around three and a half hours. As with other sightseeing points near Pahalgam, the final stretch is generally served by the local taxi stand, so a common plan is to travel by cab to Pahalgam and continue from there. Summer and early autumn are the best months, as snow can close the road in winter.',
  ],
  'betaab-valley': [
    'Betaab Valley lies about 15 km from Pahalgam on the road to Chandanwari - a green meadow along the Lidder river ringed by forested slopes. It takes its name from the 1983 Hindi film Betaab, which was shot here, and it is one of the most photographed spots in the Pahalgam area.',
    'Because it sits on the same road as Chandanwari, the two are usually visited together in a single outing from Pahalgam. Like other sightseeing points nearby, it is generally reached by the local taxi stand from Pahalgam town, so plan a cab from Srinagar to Pahalgam and continue from there. The valley is greenest from May to September.',
  ],
  chandanwari: [
    'Chandanwari is about 16 km from Pahalgam and is the road head for the Amarnath Yatra trek, which continues on foot towards Sheshnag and the Amarnath cave. Outside the yatra season it is visited for its snow bridge over the stream, which often lasts well into summer.',
    'The road from Pahalgam passes Betaab Valley, so the two are usually covered together. During the Amarnath Yatra, usually held in July and August, access and traffic on this route are regulated, so plan around the yatra schedule if you are visiting then. The last stretch from Pahalgam is generally served by the local taxi stand.',
  ],
  doodhpathri: [
    'Doodhpathri is a meadow in the Budgam district, about 40 km from Srinagar, named after the milky white water of the Shaliganga river that runs through it. It is quieter than Gulmarg or Pahalgam, with open grasslands, pine forest and streams that make it a relaxed day trip.',
    'The drive from Srinagar takes around one and a half to two hours. There are only limited stays and eateries at Doodhpathri itself, so most visitors return to Srinagar the same evening. It is at its best from April to October; snow can close the road in winter.',
  ],
  gurez: [
    'Gurez is a remote valley in the Bandipora district along the Kishanganga river, known for the Habba Khatoon peak, traditional wooden village houses and quiet riverside camps. Reaching it means crossing the Razdan Pass, which makes the drive one of the most scenic, and demanding, in Kashmir.',
    'The journey from Srinagar takes around five to six hours, so most visitors stay at least two nights. The road over Razdan Pass is open only in the warmer months and closes after heavy snow, and conditions can change quickly, so an SUV with an experienced mountain driver is the sensible choice. Carry valid photo ID, as there are checkpoints along the route.',
  ],
  jammu: [
    'Jammu, the winter capital of Jammu and Kashmir, is the main gateway for travellers arriving by road and rail from the plains. The city is known for its temples, including the Raghunath Temple, and for Bahu Fort overlooking the Tawi river.',
    'From Jammu, cabs commonly run to Katra for Vaishno Devi, to the hill station of Patnitop, and all the way to Srinagar on the Jammu-Srinagar national highway via Udhampur, Ramban and Banihal. That full drive usually takes most of a day, so an early start and a comfortable sedan or SUV make a real difference.',
  ],
  'jammu-railway': [
    'Jammu Tawi is the main railway station for the Jammu region and, for many travellers, the starting point of a Kashmir or Vaishno Devi trip. Trains from Delhi and across India arrive here, and the station is a short drive from the city centre and hotels.',
    'A cab booked in advance means a driver meets you at the station after a long train journey. The most common onward routes are to Katra for Vaishno Devi, about 50 km away, to Patnitop, and the full-day drive to Srinagar. Road transfers are the most flexible option when you are travelling with luggage, children or a group.',
  ],
  katra: [
    'Katra, in the Reasi district, is the base town for the Mata Vaishno Devi shrine and the starting point of the yatra trek up the Trikuta hills. It is about 50 km from Jammu and has its own railway station, Shri Mata Vaishno Devi Katra.',
    'Pilgrims usually reach Katra by cab from Jammu railway station or airport, complete the yatra, and then either return to Jammu or continue to Patnitop or Srinagar by road. Booking a cab for both legs saves waiting for transport after a tiring trek, and an SUV is useful for families travelling with elderly members and luggage.',
  ],
  patnitop: [
    'Patnitop is a hill station in the Udhampur district on the Jammu-Srinagar highway, set among deodar and pine forest at a little over 2,000 metres. It is a popular stop on the Jammu-Srinagar drive and a weekend getaway from Jammu, with nearby Nathatop and Sanasar adding meadows, viewpoints and winter snow.',
    'The Chenani-Nashri tunnel now lets highway traffic bypass Patnitop, so if you want to stop there on the way to Srinagar, ask your driver to take the old road over the hill. From Jammu the drive takes around three to four hours, making it easy to combine with a Vaishno Devi visit from Katra.',
  ],
  yusmarg: [
    'Yusmarg is a meadow in the Budgam district, about 47 km from Srinagar, surrounded by pine and fir forest at the foot of the Pir Panjal range. The Doodh Ganga river runs nearby, and the short walk or pony ride to Nilnag Lake is the most popular outing here.',
    'The drive from Srinagar takes about one and a half hours through villages and orchards, making Yusmarg an easy day trip. It sees far fewer visitors than Gulmarg or Pahalgam, so it suits travellers looking for a quieter day in the meadows. Summer is the best season; snow covers the meadow in winter.',
  ],
};

export function cabContent(slug: string, name: string): SeoContent | undefined {
  const intro = cabIntro[slug];
  if (!intro) return undefined;
  return {
    heading: `Cabs in ${name}: What to Know Before You Travel`,
    paragraphs: intro,
    subsections: [
      {
        heading: `Booking a cab in ${name} with Twin Brothers Holidays`,
        points: [
          'Choose a hatchback, sedan or SUV based on your group size and luggage, and see the fare before you confirm.',
          'Book a one-way transfer, a round trip, full-day sightseeing or an hourly rental from the same page.',
          'Share your pickup point, date and time, and our team confirms the booking and driver details.',
          'Need hotels or sightseeing as well? Use Customize Package and we will plan the whole trip around your cab.',
        ],
      },
    ],
  };
}

/* ------------------------------- Activities ------------------------------- */

const activityCity: Record<string, SeoContent> = {
  kashmir: {
    heading: 'Things to Do in Kashmir',
    paragraphs: [
      'Kashmir rewards travellers who plan a few experiences around the sightseeing. A shikara ride on Dal Lake in Srinagar is the classic first evening, followed by walks through the Mughal Gardens of Nishat, Shalimar and Chashme Shahi. In Gulmarg the Gondola cable car climbs towards Mount Apharwat, giving views across the Pir Panjal range, while Pahalgam offers river rafting on the Lidder.',
      'Further out, Sonamarg is the base for pony rides to the Thajiwas Glacier, and quieter meadows such as Doodhpathri and Yusmarg are ideal for nature walks and a slower day away from the busier spots.',
    ],
    subsections: [
      {
        heading: 'When to plan your Kashmir activities',
        paragraphs: [
          'Spring and summer (April to August) are best for gardens, meadows, pony rides and rafting. Autumn brings golden chinar trees and clear skies, and winter (December to February) turns Gulmarg into a snow and ski destination. The Gulmarg Gondola is popular in every season, so booking ahead helps you avoid long queues.',
        ],
      },
    ],
  },
  goa: {
    heading: 'Things to Do in Goa',
    paragraphs: [
      'Goa is best known for its beaches, but the activities go well beyond the sand. Grand Island, off the coast near Vasco, is one of the most popular spots for a first scuba dive or snorkelling trip. Old Goa is home to the Basilica of Bom Jesus and the Se Cathedral, part of a UNESCO World Heritage site, and a heritage walk there pairs well with a visit to one of the spice plantations inland.',
      'Evenings are for river cruises on the Mandovi, beach shacks and the night markets of North Goa, while South Goa offers quieter beaches for a slower pace.',
    ],
    subsections: [
      {
        heading: 'When to plan your Goa activities',
        paragraphs: [
          'The main season runs from October to May, when the sea is calm and water sports operate normally. During the monsoon (roughly June to September) sea-based activities such as scuba diving and boat trips are usually suspended, but the countryside, waterfalls and spice plantations are at their greenest.',
        ],
      },
    ],
  },
  dubai: {
    heading: 'Things to Do in Dubai',
    paragraphs: [
      "Dubai packs a lot into a short trip. The At the Top observation decks on the Burj Khalifa give views over the city, the Gulf and the desert from the world's tallest building, and the Dubai Aquarium and Underwater Zoo is right below it inside The Dubai Mall. An evening desert safari - dune drives, a camel ride, sunset views and a dinner with live shows - is the most popular half-day experience.",
      'Back in the city, a dhow cruise along Dubai Marina or Dubai Creek shows the skyline lit up at night, and the older Al Fahidi and souk areas around the Creek give a feel for the city before the towers.',
    ],
    subsections: [
      {
        heading: 'When to plan your Dubai activities',
        paragraphs: [
          'November to March is the most comfortable time, with warm days and cool evenings that suit desert safaris and outdoor sightseeing. Summers are very hot, so outdoor activities are best kept to early mornings and evenings, with malls and indoor attractions in between.',
        ],
      },
    ],
  },
  kerala: {
    heading: 'Things to Do in Kerala',
    paragraphs: [
      "Kerala's experiences change with the landscape. In the hills around Munnar, guided tea garden walks and factory visits show how tea is grown and processed, and Eravikulam National Park is known for the endangered Nilgiri tahr and the rolling grasslands of the Western Ghats. Down on the coast, a houseboat or shikara ride on the backwaters of Alleppey and Kumarakom is the signature Kerala experience.",
      'Add a Kathakali performance, an Ayurvedic massage or a walk through Fort Kochi to round out a trip that balances nature, culture and rest.',
    ],
    subsections: [
      {
        heading: 'When to plan your Kerala activities',
        paragraphs: [
          'September to March is the most pleasant time for sightseeing and backwater cruises. Munnar stays cool for much of the year, and the monsoon months bring lush scenery and lower crowds. Eravikulam National Park usually closes for a few weeks in early spring during the Nilgiri tahr calving season, so check dates before you plan.',
        ],
      },
    ],
  },
  leh: {
    heading: 'Things to Do in Leh-Ladakh',
    paragraphs: [
      "Leh is the starting point for Ladakh's best-known day trips. Khardung La, one of the highest motorable passes in the region, is the gateway to the Nubra Valley and its sand dunes at Hunder, while the drive to Pangong Tso brings you to the high-altitude lake famous for its changing shades of blue. Around Leh itself, Shanti Stupa, Leh Palace and monasteries such as Thiksey and Hemis are easy half-day visits.",
      'Plan your first day in Leh to rest and acclimatise to the altitude before heading to high passes and lakes - it makes the rest of the trip far more comfortable.',
    ],
    subsections: [
      {
        heading: 'When to plan your Ladakh activities',
        paragraphs: [
          'The main season runs from May to September, when the high passes are open and day trips to Pangong and Nubra run regularly. Visiting protected areas such as Nubra and Pangong requires a permit, which is usually arranged before the trip. Winters are extremely cold and many routes close.',
        ],
      },
    ],
  },
  manali: {
    heading: 'Things to Do in Manali',
    paragraphs: [
      'Manali is an adventure base as much as a hill station. Solang Valley, a short drive away, is the hub for paragliding, zorbing and the ropeway, and turns into a snow-play area in winter. Rohtang Pass and, since the opening of the Atal Tunnel, the Sissu side of the Lahaul valley are the most popular excursions for snow and high-mountain views.',
      'In town, the Hadimba Devi Temple set in cedar forest, the cafes of Old Manali and the Mall Road make for an easy, relaxed day between excursions.',
    ],
    subsections: [
      {
        heading: 'When to plan your Manali activities',
        paragraphs: [
          'March to June is ideal for sightseeing and adventure sports, and December to February brings snow to Solang Valley. Vehicle permits for Rohtang Pass are limited each day and the pass closes in winter, so plan that excursion early in your trip.',
        ],
      },
    ],
  },
};

export function activityCityContent(citySlug: string): SeoContent | undefined {
  return activityCity[citySlug];
}

/* ------------------------------ Destinations ------------------------------ */

const destinations: Record<string, SeoContent> = {
  domestic: {
    heading: 'Domestic Holiday Destinations in India',
    paragraphs: [
      "India packs mountains, beaches, backwaters and deserts into a single country, and every region suits a different kind of trip. The valleys of Kashmir, Ladakh and Himachal are made for scenic road journeys and snow, Kerala and Goa for slower coastal holidays, and Rajasthan for forts, palaces and desert camps.",
      'Each destination below groups the packages we currently offer there, so you can compare itineraries, durations and inclusions side by side. If a ready-made package does not fit your dates or budget, use Customize Package and our team will plan a trip around your requirements.',
    ],
  },
  international: {
    heading: 'International Holiday Destinations',
    paragraphs: [
      'An international holiday works best when the flights, visa, hotels and sightseeing are planned together. Our international packages list what is included - stays, transfers and key experiences - so you can see the full picture before you book.',
      'Dubai is currently our main international destination, combining modern city sightseeing such as the Burj Khalifa with desert safaris and marina cruises. For other countries or a custom itinerary, send an enquiry through Customize Package and our team will plan around your travel dates.',
    ],
  },
  kashmir: {
    heading: 'Kashmir Holiday Destinations',
    paragraphs: [
      'Kashmir is best explored as a circuit. Most trips start in Srinagar, with houseboat stays and shikara rides on Dal Lake, then continue to Gulmarg for its meadows and Gondola, Pahalgam for the Lidder valley, and Sonamarg for the Thajiwas Glacier. Quieter meadows such as Doodhpathri and Yusmarg suit travellers who want fewer crowds.',
      'Spring and summer bring gardens in bloom and green meadows, autumn brings golden chinar trees, and winter turns Gulmarg into a snow destination. The packages here combine stays, transport and sightseeing for different trip lengths and budgets.',
    ],
  },
  ladakh: {
    heading: 'Ladakh Holiday Destinations',
    paragraphs: [
      'Ladakh is a high-altitude desert of monasteries, mountain passes and blue lakes. Most trips are based in Leh and include day trips or overnight stays at Pangong Tso and the Nubra Valley via Khardung La, along with monasteries such as Thiksey and Hemis.',
      'The travel season runs roughly from May to September, when the passes are open. Because of the altitude, good itineraries build in a rest day in Leh on arrival. Packages here are planned around acclimatisation, permits and the road distances between Leh, Nubra and Pangong.',
    ],
  },
  himachal: {
    heading: 'Himachal Holiday Destinations',
    paragraphs: [
      'Himachal Pradesh combines colonial-era hill towns with adventure country. Shimla and its Mall Road are the classic starting point, Manali is the base for Solang Valley, Rohtang Pass and the Atal Tunnel, and Kasol and the Parvati Valley draw travellers looking for riverside stays and treks.',
      'Summer is popular for escaping the heat of the plains, while winter brings snow to the higher towns. Many travellers combine Shimla and Manali in one road trip, and the packages here are planned around those routes.',
    ],
  },
  kerala: {
    heading: 'Kerala Holiday Destinations',
    paragraphs: [
      "Kerala's variety is its strength: the tea-covered hills of Munnar, the backwaters of Alleppey and Kumarakom, the wildlife of Thekkady and the heritage streets of Fort Kochi can all fit into one trip. Houseboat stays on the backwaters are the highlight for most visitors.",
      'September to March is the most comfortable season, while the monsoon brings lush green landscapes and quieter roads. Packages here combine hill stations, backwaters and coastal stays to suit families, couples and first-time visitors.',
    ],
  },
  goa: {
    heading: 'Goa Holiday Destinations',
    paragraphs: [
      'Goa splits naturally into two holidays. North Goa, around Baga, Calangute and Anjuna, is lively with beach shacks, water sports and night markets, while South Goa, around Palolem and Colva, is quieter and slower. Old Goa adds UNESCO-listed churches, and inland spice plantations make a good half-day trip.',
      'The main season runs from October to May. The packages here mix beach stays with sightseeing, water sports and heritage visits so you can choose the pace that suits you.',
    ],
  },
  rajasthan: {
    heading: 'Rajasthan Holiday Destinations',
    paragraphs: [
      "Rajasthan is India's land of forts and palaces. Jaipur's Amber Fort and Hawa Mahal, Udaipur's lakes and City Palace, Jodhpur's Mehrangarh Fort and the golden fort and desert camps of Jaisalmer form the classic circuit, with Pushkar and Ranthambore as popular additions.",
      'October to March is the best time to visit, when days are pleasant for sightseeing and desert nights are cool. The packages here cover one or more of these cities with stays, transport and guided sightseeing.',
    ],
  },
  dubai: {
    heading: 'Dubai Holiday Destinations',
    paragraphs: [
      "Dubai combines record-breaking architecture with desert adventure. A typical trip covers the Burj Khalifa and The Dubai Mall, a desert safari with dinner, a dhow cruise along the Marina or Creek, and time in the older souks around Al Fahidi.",
      'November to March offers the most comfortable weather. The packages here include hotel stays, transfers and key experiences, and our team can help plan the visa and flights alongside the trip.',
    ],
  },
};

const destinationPlanning: Record<string, { heading: string; paragraphs: string[] }> = {
  domestic: {
    heading: 'How to choose a domestic destination',
    paragraphs: [
      'For snow and mountain scenery, Kashmir, Himachal and Ladakh are the strongest choices - Ladakh is best from May to September, while Kashmir and Himachal are worth visiting in every season. For a coastal break, Goa suits travellers looking for beaches and nightlife, and Kerala combines beaches with backwaters and hill stations. Rajasthan is at its best between October and March for culture, history and desert landscapes.',
      'Most domestic trips work well in five to eight days, and many travellers combine nearby regions, such as Kashmir with Ladakh, into a single itinerary.',
    ],
  },
  international: {
    heading: 'Planning an international trip',
    paragraphs: [
      'Start with the basics: check that your passport is valid well beyond your return date and find out the visa requirements for your destination, as some visas take time to process. Book flights early if you are travelling in peak season or during Indian school holidays, when fares rise quickly.',
      'Travel insurance is worth considering for any trip abroad. Our team can help you line up the visa, flights, hotels and sightseeing together so the whole trip is planned around the same dates.',
    ],
  },
  kashmir: {
    heading: 'How long to spend in Kashmir',
    paragraphs: [
      'Five to seven days covers Srinagar, Gulmarg, Pahalgam and Sonamarg at a comfortable pace, usually with two or three nights in Srinagar, including a houseboat night, and a night in Pahalgam. Add a day or two for Doodhpathri or Yusmarg, or extend to Gurez for something more remote.',
      'Srinagar airport is the most convenient arrival point. Travellers coming by train usually arrive at Jammu or Katra and continue by road, which also makes it easy to add a Vaishno Devi visit.',
    ],
  },
  ladakh: {
    heading: 'How long to spend in Ladakh',
    paragraphs: [
      'Six to eight days is a comfortable length: two days in and around Leh to acclimatise, two days for the Nubra Valley via Khardung La, and an overnight trip to Pangong Tso. Many travellers fly into Leh; others drive in from Srinagar via Kargil or from Manali, which adds days but helps the body adjust to the altitude.',
      'Carry warm layers even in summer, as nights at the lakes and passes are cold, and keep some cash, since card payments and mobile networks can be limited away from Leh.',
    ],
  },
  himachal: {
    heading: 'How long to spend in Himachal',
    paragraphs: [
      'A Shimla-Manali trip usually takes six to seven days including the road journey from Delhi or Chandigarh. Add Dharamshala and McLeod Ganj for Tibetan culture and monasteries, or Kasol for the Parvati Valley.',
      'Roads in the higher areas can close after heavy snow in winter, so it helps to build some flexibility into winter itineraries, especially for trips towards Rohtang Pass and the Lahaul valley.',
    ],
  },
  kerala: {
    heading: 'How long to spend in Kerala',
    paragraphs: [
      'Five to seven days covers a classic circuit: Kochi, two nights in Munnar, a night in Thekkady and a houseboat night on the Alleppey backwaters. Kochi has the main international airport, which makes it the usual starting point.',
      'Add a few beach days at Varkala or Kovalam if you would like to end the trip by the sea, or an Ayurveda stay if you want the holiday to double as a rest.',
    ],
  },
  goa: {
    heading: 'How long to spend in Goa',
    paragraphs: [
      'Three to five days is enough for most Goa holidays - a couple of beach days, an Old Goa heritage visit, a spice plantation and a day of water sports. Goa has two airports, Dabolim and Mopa, and is also well connected by train via Madgaon and Thivim.',
      'Choose a stay in North Goa if you want activity and nightlife, or South Goa for quieter beaches and a slower pace. Many travellers split their stay between the two.',
    ],
  },
  rajasthan: {
    heading: 'How long to spend in Rajasthan',
    paragraphs: [
      'A Jaipur-Udaipur trip fits into five or six days; adding Jodhpur and Jaisalmer makes it eight to ten days, as the distances between cities are long. Jaipur is the usual starting point, a few hours by road from Delhi.',
      'Desert camps near Jaisalmer are best experienced between October and February, when nights are cool and the skies are clear. Summers are very hot, so most travellers avoid April to June.',
    ],
  },
  dubai: {
    heading: 'How long to spend in Dubai',
    paragraphs: [
      'Four or five days covers the main sights: a day for Downtown Dubai and the Burj Khalifa, a desert safari, a dhow cruise and time for shopping or a theme park. Abu Dhabi, home to the Sheikh Zayed Grand Mosque, is an easy day trip by road.',
      'Most Indian passport holders need a visa arranged before travel, so start the application early. Our team can help with the visa alongside flights, hotels and sightseeing.',
    ],
  },
};

export function destinationContent(slug: string): SeoContent | undefined {
  const content = destinations[slug];
  if (!content) return undefined;
  const planning = destinationPlanning[slug];
  return planning ? { ...content, subsections: [planning] } : content;
}

/* ------------------------------- Group tours ------------------------------ */

const groupTours: Record<string, SeoContent> = {
  kashmir: {
    heading: 'Kashmir Group Tours: How They Work',
    paragraphs: [
      'A Kashmir group tour lets you see the valley without planning every transfer yourself. Itineraries typically cover Srinagar and Dal Lake, a day in Gulmarg, Pahalgam and the Lidder valley, and Sonamarg, with shared transport between each stop and stays arranged in advance.',
      'Group tours suit solo travellers who want company, friends travelling together, and families who would rather leave the logistics to someone else. Because Kashmir trips involve long drives between hill towns, travelling with a fixed plan and a driver who knows the routes makes the days far easier.',
    ],
  },
  ladakh: {
    heading: 'Ladakh Group Tours: How They Work',
    paragraphs: [
      'Ladakh group tours are built around altitude. A good itinerary starts with a rest day in Leh, then moves on to the Nubra Valley over Khardung La and to Pangong Tso, with monastery visits around Leh in between.',
      'Travelling in a group makes the long mountain drives more sociable and keeps costs sensible, while permits for protected areas are arranged as part of the plan. The season runs roughly from May to September, when the passes are open.',
    ],
  },
  himachal: {
    heading: 'Himachal Group Tours: How They Work',
    paragraphs: [
      'Himachal group tours usually follow the Shimla-Manali route, combining the colonial hill town of Shimla with Manali, Solang Valley and, depending on the season, a trip towards Rohtang Pass or the Atal Tunnel.',
      'They are a popular choice for college groups, friends and families travelling together from the plains, since transport, stays and sightseeing are planned in one package. Summer is the busiest season, and winter departures focus on snow.',
    ],
  },
  kerala: {
    heading: 'Kerala Group Tours: How They Work',
    paragraphs: [
      'Kerala group tours typically link the hills of Munnar with the backwaters of Alleppey, sometimes adding Thekkady or Fort Kochi. Travelling as a group makes houseboat stays and longer road transfers between regions simple to organise.',
      'They suit families, friends and first-time visitors who want to see the main highlights at a comfortable pace. September to March is the most popular period for group departures.',
    ],
  },
  goa: {
    heading: 'Goa Group Tours: How They Work',
    paragraphs: [
      "Goa group tours balance beach time with sightseeing - typically North Goa's beaches and nightlife, Old Goa's heritage churches and a spice plantation visit, with optional water sports such as a Grand Island trip.",
      'Group travel to Goa is popular with friends and college groups, as shared transport and pre-booked stays keep the trip easy and costs predictable. The main season runs from October to May.',
    ],
  },
  rajasthan: {
    heading: 'Rajasthan Group Tours: How They Work',
    paragraphs: [
      "Rajasthan group tours usually cover two or more of the state's royal cities - Jaipur, Udaipur, Jodhpur and Jaisalmer - with guided fort and palace visits and, in Jaisalmer, a night at a desert camp.",
      'Because the distances between cities are long, a group itinerary with shared transport and planned stays saves a lot of effort. October to March is the best season for Rajasthan group departures.',
    ],
  },
  dubai: {
    heading: 'Dubai Group Tours: How They Work',
    paragraphs: [
      'Dubai group tours combine the city highlights - the Burj Khalifa, The Dubai Mall and a Marina or Creek dhow cruise - with an evening desert safari, with transfers and hotel stays planned for the whole group.',
      'Travelling as a group makes an international trip simpler, as hotels, airport transfers and sightseeing are arranged together. November to March is the most comfortable time to visit.',
    ],
  },
};

export function groupTourContent(slug: string): SeoContent | undefined {
  const content = groupTours[slug];
  if (!content) return undefined;
  return {
    ...content,
    subsections: [
      {
        heading: 'Before you book a group tour',
        points: [
          'Check the itinerary, duration and inclusions listed on each package before you request a callback.',
          'Tell our team your preferred dates and group size so we can confirm availability.',
          'Prefer a private trip instead? Use Customize Package and we will plan the same route just for your group.',
        ],
      },
    ],
  };
}

/* ---------------------------- Package categories -------------------------- */

const categories: Record<string, SeoContent> = {
  adventure: {
    heading: 'Adventure Holiday Packages',
    paragraphs: [
      'Adventure packages are built around experiences rather than just sightseeing - river rafting in Pahalgam, the Gulmarg Gondola and winter skiing, paragliding and snow sports at Solang Valley near Manali, high-altitude drives over Ladakh passes, and scuba diving at Grand Island in Goa.',
      'Each package lists the activities included, the season they run in and any fitness considerations, so you know what to expect before booking. Adventure activities depend on weather and local conditions, so our team confirms timings closer to your travel date.',
    ],
  },
  family: {
    heading: 'Family Holiday Packages',
    paragraphs: [
      'Family packages are planned for comfortable pacing - fewer very long drives, family-friendly hotels and sightseeing that works for both children and grandparents. Popular choices include Kashmir with its gardens and shikara rides, the hills and backwaters of Kerala, and the beaches of Goa.',
      'Each package lists the stays, transport and sightseeing included. If you are travelling with young children or elderly family members, mention it in your enquiry and our team will suggest the right vehicle and pace.',
    ],
  },
  general: {
    heading: 'Holiday Packages for Every Traveller',
    paragraphs: [
      'These packages cover the essentials of a destination - stays, transport and the main sightseeing - without being tied to a particular travel style. They are a good starting point if you are visiting a place for the first time and want a balanced itinerary.',
      'Compare durations and inclusions across destinations, and use Customize Package if you would like to adjust the hotels, add activities or change the number of days.',
    ],
  },
  group: {
    heading: 'Group Holiday Packages',
    paragraphs: [
      'Group packages make it easy for friends, families, colleagues and college groups to travel together. Transport, stays and sightseeing are planned for the whole group, so nobody has to organise bookings separately.',
      'Packages are available for destinations including Kashmir, Ladakh, Himachal, Kerala, Goa, Rajasthan and Dubai. Share your group size and dates with our team to confirm availability and vehicle arrangements.',
    ],
  },
  honeymoon: {
    heading: 'Honeymoon Packages',
    paragraphs: [
      'Honeymoon packages focus on privacy, scenery and a relaxed pace. Kashmir is a favourite for houseboat stays on Dal Lake and the meadows of Gulmarg and Pahalgam, Kerala for backwater houseboats and the hills of Munnar, and Goa and Dubai for couples who want beaches or a city break.',
      'Each package lists the hotels, transfers and experiences included. Tell our team about any special occasions or preferences in your enquiry, and we will suggest stays and timings that suit you.',
      'Timing matters for a honeymoon. Kashmir is magical in snow from December to February and green from April to June, the Kerala backwaters are most comfortable from September to March, and Goa and Dubai are best in the cooler months. If your dates are fixed by the wedding, tell us and we will suggest the destination that suits that season.',
    ],
  },
  luxury: {
    heading: 'Luxury Holiday Packages',
    paragraphs: [
      'Luxury packages pair premium hotels and resorts with private transport and a slower, more comfortable itinerary. In Kashmir this can mean lakeside and hilltop resorts in Srinagar, Gulmarg and Pahalgam; elsewhere it means handpicked stays chosen for their setting and service.',
      'Each package lists the hotels and inclusions upfront. If you have a specific hotel or room type in mind, mention it in your enquiry and our team will check availability for your dates.',
      'Luxury does not have to mean a long trip. A three- or four-night stay at one well-chosen resort, with private transfers and a couple of curated experiences, can feel more relaxing than a busy multi-city tour. Tell us whether you prefer a lakeside, hilltop or heritage property, and whether you would like meals included, and we will put together options for your dates.',
    ],
  },
  religious: {
    heading: 'Religious and Pilgrimage Tour Packages',
    paragraphs: [
      'Pilgrimage packages take care of the travel so you can focus on the yatra. Popular trips include Mata Vaishno Devi from Katra, with transfers from Jammu, and visits to shrines across Kashmir and the rest of India.',
      'Each package lists the transport, stays and darshan-related arrangements included. If you are travelling with elderly family members, let our team know so we can plan vehicles and pacing accordingly.',
      'Pilgrimage travel often comes with fixed dates and rules, such as yatra registration and limits on what you can carry on the trek, so it pays to plan early - especially for the Amarnath Yatra and for Vaishno Devi during festivals like Navratri, when crowds peak. We can arrange transfers to the starting points, stays close to the route and the onward journey after your visit.',
    ],
  },
  solo: {
    heading: 'Solo Travel Packages',
    paragraphs: [
      'Solo packages give you a planned itinerary with the flexibility to travel on your own schedule. Transfers and stays are arranged in advance, so you are not left negotiating transport in an unfamiliar place.',
      'Popular solo trips include Kashmir, Ladakh, Himachal and Goa. If you would prefer company along the way, take a look at our group tours.',
      'Travelling alone also means you set your own pace: spend an extra day where you like it, skip what does not interest you, and join activities such as rafting, a shikara ride or a desert safari when you want company. If your plans change during the trip, contact our team and we will help adjust your bookings.',
    ],
  },
};

const categoryHighlights: Record<string, { heading: string; points: string[] }> = {
  adventure: {
    heading: 'Popular adventure experiences by destination',
    points: [
      'Kashmir: river rafting on the Lidder in Pahalgam, the Gulmarg Gondola, and skiing and snowboarding in Gulmarg in winter.',
      'Himachal: paragliding, zorbing and the ropeway at Solang Valley, and snow trips towards Rohtang Pass.',
      'Ladakh: high-altitude drives over Khardung La and to Pangong Tso, and camping in the Nubra Valley.',
      'Goa: scuba diving and snorkelling at Grand Island, along with water sports on the beaches in season.',
      'Dubai: dune drives and sandboarding on an evening desert safari.',
    ],
  },
  family: {
    heading: 'What makes a family trip work',
    points: [
      'Fewer hotel changes, so children are not packing and unpacking every day.',
      'Shorter driving days with time for meals and rest stops.',
      'Sightseeing that suits all ages, such as shikara rides, gardens, cable cars and beaches.',
      'A vehicle with enough room for everyone and the luggage.',
      'Hotels with family rooms or connecting rooms where available.',
    ],
  },
  general: {
    heading: 'How to choose the right package',
    points: [
      'Duration: check the number of nights and how they are split between places.',
      'Inclusions: look at what is covered - stays, meals, transport and sightseeing - and what is not.',
      'Season: some sightseeing depends on the weather, so match the package to your travel month.',
      'Budget: compare the per-person price and ask our team about options if you need something different.',
    ],
  },
  group: {
    heading: 'Planning a group trip',
    points: [
      'Confirm your group size early so the right vehicles and rooms can be arranged.',
      'Agree on a budget and travel dates before you enquire.',
      'Mention any members who need extra comfort, such as children or elderly travellers.',
      'Let us know if the group would like private sightseeing or a shared, fixed itinerary.',
    ],
  },
  honeymoon: {
    heading: 'Popular honeymoon destinations',
    points: [
      'Kashmir: a houseboat night on Dal Lake, the meadows and snow of Gulmarg, and riverside stays in Pahalgam.',
      'Kerala: a private houseboat on the Alleppey backwaters and tea-garden stays in Munnar.',
      'Goa: beach resorts, sunset cruises and quieter South Goa beaches.',
      'Dubai: city views from the Burj Khalifa, a desert dinner and a dhow cruise.',
      'Himachal: cedar forests around Manali and snow in winter.',
    ],
  },
  luxury: {
    heading: 'What luxury packages focus on',
    points: [
      'Premium hotels and resorts chosen for their setting and service.',
      'Private transfers in a comfortable sedan or SUV throughout the trip.',
      'An unhurried itinerary with time to enjoy the hotel, not just the sightseeing.',
      'Signature experiences such as a private shikara ride, the Gulmarg Gondola or a desert dinner.',
    ],
  },
  religious: {
    heading: 'Popular pilgrimage trips',
    points: [
      'Mata Vaishno Devi, Katra: the trek up the Trikuta hills, with helicopter services available for part of the route.',
      'Amarnath Yatra: held in summer via the Pahalgam (Chandanwari) and Baltal routes, with registration required in advance.',
      'Kheer Bhawani Temple at Tulmulla and the Shankaracharya Temple overlooking Dal Lake in Srinagar.',
      'Hazratbal Shrine on the banks of Dal Lake.',
    ],
  },
  solo: {
    heading: 'Tips for travelling solo',
    points: [
      'Share your itinerary and hotel details with family before you leave.',
      'In Jammu & Kashmir and Ladakh, prepaid mobile connections from other states generally do not work, so carry a postpaid number.',
      'Keep some cash for remote areas, where ATMs and card payments can be limited.',
      'In Ladakh, rest for a day in Leh before heading to the high passes and lakes.',
    ],
  },
};

export function categoryContent(categoryName: string): SeoContent | undefined {
  const key = categoryName.trim().toLowerCase();
  const content = categories[key];
  if (!content) return undefined;
  const highlights = categoryHighlights[key];
  return highlights ? { ...content, subsections: [highlights] } : content;
}

/* ---------------------------------- Static -------------------------------- */

export const blogContent: SeoContent = {
  heading: 'About the Twin Brothers Holidays Travel Blog',
  paragraphs: [
    'Our blog shares practical travel advice from the team that plans these trips every day - when to visit each destination, how long to stay, what to pack, and how to get between places. Guides cover Kashmir in depth, along with Ladakh, Himachal, Kerala, Goa, Rajasthan and Dubai.',
    'Use the categories above to jump to a topic, such as the best time to visit Kashmir or ideas for planning a Kashmir tour package.',
  ],
  subsections: [
    {
      heading: 'How to use our travel guides',
      paragraphs: [
        'Start with a best-time-to-visit guide to choose your travel month, since weather changes what you can do in places like Kashmir and Ladakh. Then read about the destination to decide how many days you need and which towns to stay in.',
        'Once you have a rough plan, compare our holiday packages for that destination, or send an enquiry through Customize Package with your dates and budget. You can also book a hotel, cab or activity on its own if you have already planned the rest of the trip yourself.',
      ],
    },
  ],
};

export const contactContent: SeoContent = {
  heading: 'How We Can Help You Plan Your Trip',
  paragraphs: [
    'Whether you have already picked a package or are still deciding where to go, our team can help with holiday packages, hotel bookings, cab transfers, local activities, group tours and visa assistance.',
    'To get the quickest response, share your destination, travel dates, number of travellers and an approximate budget in your message. If you are booking for a special occasion, travelling with children or elderly family members, or need a specific type of hotel or vehicle, mention that too so we can suggest the right options.',
  ],
  subsections: [
    {
      heading: 'Things we can help with',
      points: [
        'Custom itineraries built around your dates and budget',
        'Hotel, cab and activity bookings on their own or combined',
        'Changes to an existing booking or enquiry',
        'Group travel for families, friends and organisations',
      ],
    },
  ],
};

export const visaContent: SeoContent = {
  heading: 'Planning Your Visa With Twin Brothers Holidays',
  paragraphs: [
    'A visa is often the first step of an international trip, and the requirements depend on your nationality, the country you are visiting and the purpose of travel. Our team can guide you on the documents usually needed, help you prepare the application and plan the rest of the trip - flights, hotels and sightseeing - around it.',
    'Start early: processing times vary by country and season, and some applications need supporting documents such as bank statements, hotel bookings or a return ticket. Final visa decisions are always made by the relevant embassy or immigration authority.',
  ],
  subsections: [
    {
      heading: 'What to have ready',
      points: [
        'A passport valid well beyond your travel dates, with blank pages',
        'Recent passport-size photographs to the required specification',
        'Your travel dates, itinerary and hotel details',
        'Any financial or employment documents the destination country asks for',
      ],
    },
  ],
};

export const offersHubContent: SeoContent = {
  heading: 'How Our Offers Work',
  paragraphs: [
    'This page lists every offer currently running across holiday packages, hotels, cabs and other services. Each offer card shows its code, what it applies to and how long it is valid, and opening an offer shows its full details and terms.',
    'Offers change through the year, so check the validity date before you plan around one. To use an offer, mention its code when you enquire or book, and our team will confirm whether it applies to your trip.',
  ],
  subsections: [
    {
      heading: 'Types of offers we run',
      points: [
        'Cab offers on airport transfers, outstation trips and hourly rentals.',
        'Hotel offers, such as booking selected Kashmir hotels with zero advance.',
        'Holiday package offers for honeymooners and for travel in particular seasons.',
        'Welcome offers for travellers booking with us for the first time.',
      ],
    },
    {
      heading: 'Before you use an offer',
      points: [
        'Open the offer to read its full terms and the services it covers.',
        'Check the validity date against your travel or booking date.',
        'Keep the offer code handy and share it with our team when you book.',
      ],
    },
  ],
};

export function offerDetailContent(title: string): SeoContent {
  return {
    heading: `How to Use the ${title} Offer`,
    paragraphs: [
      'Read the details and terms above to check which bookings this offer applies to and how long it is valid. When you are ready, mention the offer code in your enquiry or at the time of booking, and our team will confirm the benefit for your dates.',
      'Offers are subject to the terms listed on this page. If anything is unclear, contact us before you book and we will explain how it applies to your trip.',
    ],
  };
}
