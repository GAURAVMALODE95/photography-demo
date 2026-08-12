export const studio = {
  name: "Your Studio",
  photographer: "Gaurav Taneja",
  role: "Wedding & Lifestyle Photographer",
  city: "Nashik · India",
  email: "xx@yourstudio.com",
  phone: "+91 1231231231",
  address: "Your Address, Your City, India",
  about: [
    "I photograph the in-between — the quiet before the varmala, the laugh after the cake, the way light finds a mother’s hands.",
    "Based in Nashik, I travel across India for weddings, maternity, birthdays, and the everyday love that lives between celebrations.",
  ],
  portrait:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
};

export const socials = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: `https://wa.me/${studio.phone}`,
  },
];

export const navLinks = [
  { to: "/photos", label: "Photography" },
  { to: "/videos", label: "Films" },
  { to: "/services", label: "Services" },
  { to: "/#pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/conatct", label: "Enquire" },
];

export const categories = [
  { id: "wedding", label: "Weddings", blurb: "Ceremonies, rituals & receptions" },
  { id: "prewedding", label: "Pre-wedding", blurb: "Couples, chemistry & soft light" },
  { id: "maternity", label: "Maternity", blurb: "Waiting seasons, gently told" },
  { id: "birthday", label: "Birthdays", blurb: "Kids, cakes & pure joy" },
  { id: "family", label: "Family", blurb: "Generations in one frame" },
];

export const services = [
  {
    title: "Wedding Photography",
    body: "Full-day or multi-day coverage — rituals, portraits, and the quiet in-betweens.",
  },
  {
    title: "Cinematic Films",
    body: "Highlight films and longer edits that feel like memory, not a highlight reel montage.",
  },
  {
    title: "Maternity & Newborn",
    body: "Soft, unhurried sessions at home or outdoors — light-led and comfortable.",
  },
  {
    title: "Birthdays & Events",
    body: "Kids’ parties, anniversaries, and family gatherings with candid energy.",
  },
  {
    title: "Pre-wedding / Couples",
    body: "Story-led couple sessions before the big day — city, destination, or quiet locations.",
  },
  {
    title: "Albums & Delivery",
    body: "Online gallery, USB, and album design support tailored to how you want to keep the day.",
  },
];

/** Gallery images by category */
export const gallery = {
  wedding: [
    "/images/wedding/01.jpg",
    "/images/wedding/02.jpg",
    "/images/wedding/03.jpg",
    "/images/wedding/04.jpg",
  "/images/wedding/05.jpg",
    "/images/wedding/06.jpg",
"/images/wedding/07.jpg",
    "/images/wedding/08.jpg",
    "/images/wedding/09.jpg",
  "/images/wedding/10.jpg",
    "/images/wedding/11.jpg",
"/images/wedding/12.jpg",
    "/images/wedding/13.jpg",
    "/images/wedding/14.jpg",
  "/images/wedding/15.jpg",
    "/images/wedding/16.jpg",
"/images/wedding/17.jpg",
    "/images/wedding/18.jpg",
"/images/wedding/19.jpg",
    "/images/wedding/20.jpg",
 
  ],
  prewedding: ["/images/prewedding/01.jpg",
     "/images/prewedding/02.jpg",
      "/images/prewedding/03.jpg",
       "/images/prewedding/04.jpg",
        "/images/prewedding/05.jpg",
 "/images/prewedding/06.jpg",
  "/images/prewedding/07.jpg",
   "/images/prewedding/08.jpg",
   "/images/prewedding/09.jpg",
   "/images/prewedding/10.jpg",
   "/images/prewedding/11.jpg",
   "/images/prewedding/12.jpg",
    ],
  maternity: [
    "/images/maternity/01.jpg",
    "/images/maternity/02.jpg",
    "/images/maternity/03.jpg",
    "/images/maternity/04.jpg",
      "/images/maternity/05.jpg",
    "/images/maternity/06.jpg",
      "/images/maternity/08.jpg",
    "/images/maternity/09.jpg",
    "/images/maternity/10.jpg",
    "/images/maternity/11.jpg",
  ],
  birthday: [
    "/images/birthday/0.jpg",
    "/images/birthday/02.jpg",
    "/images/birthday/03.jpg",
     "/images/birthday/04.jpg",
    "/images/birthday/05.jpg",
    "/images/birthday/06.jpg",
     "/images/birthday/01.jpg",
      "/images/birthday/08.jpg",
    "/images/birthday/11.jpg",
     "/images/birthday/12.jpg",
      "/images/birthday/13.jpg",
  
   
  ],
  family: ["/images/family/01.jpg", 
    "/images/family/03.jpg", 
    "/images/family/04.jpg", 
    
    
    "/images/family/02.jpg"],
};

export const films = [
  {
    title: "Varmala — A Wedding Film",
    meta: "Mumbai · Highlight",
    poster: "",
    src: "/films/f1.mp4",
  },
  {
    title: "Waiting Season",
    meta: "Maternity · Soft light",
    poster: "",
    src: "/films/f2.mp4",
  },
  {
    title: "Little Joys",
    meta: "Birthday · Family",
    poster: "",
    src: "/films/f3.mp4",
  },
  {
    title: "Together",
    meta: "Family · Portrait film",
    poster: "",
    src: "/films/f4.mp4",
  },
  {
    title: " Family Together",
    meta: "Family · Portrait film",
    poster: "",
    src: "/films/f5.mp4",
  },
   {
    title: " Family Together",
    meta: "Family · Portrait film",
    poster: "",
    src: "/films/f6.mp4",
  },
   {
    title: " Family Together",
    meta: "Family · Portrait film",
    poster: "",
    src: "/films/f7.mp4",
  },
   {
    title: " Family Together",
    meta: "Family · Portrait film",
    poster: "",
    src: "/films/f8.mp4",
  },
];

export const packages = [
  {
    name: "Essential",
    price: "₹45,000",
    note: "Birthdays · Family · Intimate days",
    features: [
      "4 hours coverage",
      "1 photographer",
      "150+ edited photos",
      "Online gallery",
    ],
  },
  {
    name: "Signature",
    price: "₹1,25,000",
    note: "Weddings · Most loved",
    featured: true,
    features: [
      "Full-day coverage",
      "2 photographers",
      "400+ edited photos",
      "Highlight film (3–5 min)",
      "Online gallery + USB",
    ],
  },
  {
    name: "Heirloom",
    price: "₹2,40,000",
    note: "Destination · Multi-day",
    features: [
      "2–3 days coverage",
      "Photo + cinema team",
      "Full gallery + album design",
      "Cinematic film (8–12 min)",
      "Same-day teaser",
    ],
  },
];



export const servicesDetailed = [
  {
    tag: "01 · Weddings",
    title: "Wedding Photography",
    description:
      "Full-day or multi-day coverage — rituals, portraits, and the quiet in-betweens. From the first mehendi strokes to the last dance, every ceremony documented with a calm, unobtrusive eye.",
    image: "/images/services/weeding.jpg",
    includes: [
      "Full-day or multi-day coverage",
      "2 photographers for key ceremonies",
      "400+ edited high-resolution photos",
      "Online gallery for sharing with family",
    ],
  },
  {
    tag: "02 · Films",
    title: "Cinematic Films",
    description:
      "Highlight films and longer edits that feel like memory, not a highlight reel montage. Natural sound, real moments, and pacing that lets your day breathe.",
    image: "/images/services/films.jpg",
    includes: [
      "3–5 min highlight film",
      "Optional full ceremony edits",
      "Licensed music or your own track",
      "4K delivery, USB or digital",
    ],
  },
  {
    tag: "03 · Maternity",
    title: "Maternity & Newborn",
    description:
      "Soft, unhurried sessions at home or outdoors — light-led and comfortable. Built around your pace, with time for rest breaks and outfit changes.",
    image: "/images/services/maternity.jpg",
    includes: [
      "60–90 minute session",
      "Home or outdoor location",
      "40+ edited photos",
      "Partner & sibling shots included",
    ],
  },
  {
    tag: "04 · Celebrations",
    title: "Birthdays & Events",
    description:
      "Kids' parties, anniversaries, and family gatherings with candid energy. I stay in the background, catching the cake-smash chaos and the quiet corner conversations alike.",
    image: "/images/services/birthday.jpg",
    includes: [
      "3–4 hours coverage",
      "150+ edited photos",
      "Candid + a few posed group shots",
      "48-hour sneak peek gallery",
    ],
  },
  {
    tag: "05 · Couples",
    title: "Pre-wedding / Couples",
    description:
      "Story-led couple sessions before the big day — city, destination, or quiet locations. A relaxed shoot that actually feels like a date, not a performance.",
    image: "/images/services/couples.jpg",
    includes: [
      "Half-day session",
      "1–2 locations of your choice",
      "60+ edited photos",
      "Save-the-date ready images",
    ],
  },
  {
    tag: "06 · Delivery",
    title: "Albums & Delivery",
    description:
      "Online gallery, USB, and album design support tailored to how you want to keep the day. Archival-quality prints and layouts, designed with you, not just handed over.",
    image: "/images/services/albums.jpg",
    includes: [
      "Custom album design",
      "Archival print USB",
      "Private online gallery, 1-year hosting",
      "Reprint & extra-copy support",
    ],
  },
];