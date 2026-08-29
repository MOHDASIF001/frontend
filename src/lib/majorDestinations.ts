// Major travel destinations (India + international), same grouping used across
// /destinations, /group-tours and /holidays — NOT individual cities from the
// destinations table (Srinagar, Gulmarg etc. all roll up into "Kashmir").
export const majorDestinations: { slug: string; label: string; image: string; matchCities: string[]; isInternational?: boolean }[] = [
  { slug: 'kashmir', label: 'Kashmir', image: '/images/pahalgam_main.png', matchCities: ['srinagar', 'gulmarg', 'pahalgam', 'sonmarg', 'sonamarg', 'yousmarg', 'kashmir'] },
  { slug: 'ladakh', label: 'Ladakh', image: '/images/destinetion-ladhak.jpg', matchCities: ['ladakh', 'leh'] },
  { slug: 'himachal', label: 'Himachal', image: '/images/Himachal.webp', matchCities: ['himachal', 'shimla', 'manali', 'dharamshala', 'kasol'] },
  { slug: 'kerala', label: 'Kerala', image: '/images/Kerala_image.jpg', matchCities: ['kerala', 'munnar', 'alleppey', 'kochi', 'wayanad'] },
  { slug: 'goa', label: 'Goa', image: '/images/dest_goa.png', matchCities: ['goa'] },
  { slug: 'rajasthan', label: 'Rajasthan', image: '/images/rajisthan.jpg', matchCities: ['rajasthan', 'jaipur', 'udaipur', 'jodhpur', 'jaisalmer'] },
  { slug: 'uttarakhand', label: 'Uttarakhand', image: '/images/Uttarakhand.webp', matchCities: ['uttarakhand', 'nainital', 'rishikesh', 'mussoorie', 'dehradun'] },
  { slug: 'meghalaya', label: 'Meghalaya', image: '/images/Meghalaya.jpg', matchCities: ['meghalaya', 'shillong', 'cherrapunji'] },
  { slug: 'delhi', label: 'Delhi', image: '/images/dest_delhi.png', matchCities: ['delhi'] },
  { slug: 'dubai', label: 'Dubai', image: '/images/dest_dubai.png', matchCities: ['dubai', 'uae'], isInternational: true },
  { slug: 'mumbai', label: 'Mumbai', image: '/images/dest_mumbai.png', matchCities: ['mumbai'] },
  { slug: 'bangalore', label: 'Bangalore', image: '/images/dest_bangalore.png', matchCities: ['bangalore', 'bengaluru'] },
  // TEMP — added for scroll-behaviour preview only, remove alongside DEMO_PACKAGES.
  { slug: 'hyderabad', label: 'Hyderabad', image: '/images/dest_hyderabad.png', matchCities: ['hyderabad'] },
  { slug: 'chennai', label: 'Chennai', image: '/images/dest_chennai.png', matchCities: ['chennai'] },
  { slug: 'bhubaneswar', label: 'Bhubaneswar', image: '/images/dest_bhubaneswar.png', matchCities: ['bhubaneswar'] },
  { slug: 'agra', label: 'Agra', image: '/images/destination-1.jpg', matchCities: ['agra'] },
  { slug: 'ooty', label: 'Ooty', image: '/images/hero-img-1.jpg', matchCities: ['ooty'] },
  { slug: 'sikkim', label: 'Sikkim', image: '/images/hero-img-2.jpg', matchCities: ['sikkim'] },
  { slug: 'andaman', label: 'Andaman', image: '/images/destinetion-tulip.jpg', matchCities: ['andaman'] },
];
