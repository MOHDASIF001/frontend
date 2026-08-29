export interface Mood {
  name: string;
  img: string;
  desc: string;
}

// Shape used by the "Popular Destinations" grid — populated from real hotel
// data (api/hotels.php?cities=1) at runtime, not hardcoded here.
export interface Destination {
  name: string;
  count: string;
  img: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export const hotelData = {
  moods: [
    { name: "Beach Vacations", img: "/images/dest_goa.png", desc: "Beachfront stays & coastal resorts" },
    { name: "Weekend Getaways", img: "/images/destination-pahalgam.jpg", desc: "Short relaxing escapes near city limits" },
    { name: "Wildlife Adventure", img: "/images/default-dest.jpg", desc: "Jungle lodges & nature campsites" },
    { name: "Mountains Calling", img: "/images/destination-gulmarg.jpg", desc: "Alpine lodges & snowy peaks" }
  ] as Mood[],

  faqs: [
    {
      q: "How can I save while booking hotels?",
      a: "You can save significantly by utilizing coupon codes listed in our Exclusive Offers section, booking standard packages combining cabs and tours, or selecting our 'Lowest Price Guarantee' properties."
    },
    {
      q: "Can I book a hotel with a local id?",
      a: "Yes! Many hotels listed on our platform accommodate guests with local identity proofs. You can filter properties or consult our customer support executive during booking inquiries to check hotel policies."
    },
    {
      q: "How can I get early check-in or late check-out in a hotel?",
      a: "Early check-in and late check-out options are subject to room availability. You can make a request to the hotel in advance, or reach out to our dedicated support desk to coordinate this for you."
    },
    {
      q: "How can unmarried couples book hotels in India?",
      a: "Yes, we partner with verified, highly-rated couple-friendly properties that respect privacy and welcome couples with valid government identity proofs."
    },
    {
      q: "How can I book cheap rooms in 5-star hotels?",
      a: "Keep an eye on our off-season flash deals, monsoon sales, or package bundles. Booking your 5-star hotel combined with cab or sightseeing services on Twin Brothers Holidays guarantees lower corporate rates."
    },
    {
      q: "How to book a hotel online?",
      a: "Select your destination, check-in and check-out dates, and number of guests in the search panel. Click 'Search' to browse verified hotels, view room plans, and click 'Details' or 'Inquiry' to complete your online booking."
    }
  ] as FAQ[]
};
