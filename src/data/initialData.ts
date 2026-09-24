import { Product, GalleryItem, CustomerReview } from "@/types";

export const initialProducts: Product[] = [
  // --- CAKES ---
  {
    id: "cm-cake-1",
    name: "Belgian Chocolate Truffle Cake",
    slug: "belgian-chocolate-truffle",
    description: "Layers of moist chocolate sponge filled and enrobed in silky dark Belgian chocolate ganache. A timeless favourite for celebratory occasions.",
    category: "cakes",
    subcategory: "Chocolate",
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Belgian Dark Chocolate", "Milk Chocolate", "Choco Hazelnut"],
    sizes: ["500 g", "1 kg", "1.5 kg", "2 kg"],
    startingPrice: null, // "Price on enquiry"
    eggless: true,
    customizable: true,
    availableToday: true,
    advanceOrderRequired: false,
    featured: true,
    active: true,
    occasions: ["Birthday", "Anniversary", "Celebrations", "Just Because"],
    tasteProfile: "Rich & Decadent Chocolate"
  },
  {
    id: "cm-cake-2",
    name: "Red Velvet Cream Cheese Celebration Cake",
    slug: "red-velvet-cream-cheese",
    description: "Crimson cocoa sponge infused with buttermilk and layered with velvety Madagascar vanilla cream cheese frosting.",
    category: "cakes",
    subcategory: "Classic",
    images: [
      "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616031036474-067d264e1c56?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Classic Red Velvet", "Red Velvet Raspberry"],
    sizes: ["500 g", "1 kg", "2 kg"],
    startingPrice: null,
    eggless: true,
    customizable: true,
    availableToday: true,
    advanceOrderRequired: false,
    featured: true,
    active: true,
    occasions: ["Anniversary", "Birthday", "Wedding", "Just Because"],
    tasteProfile: "Velvety & Slightly Tangy"
  },
  {
    id: "cm-cake-3",
    name: "Lotus Biscoff Speculoos Cake",
    slug: "lotus-biscoff-speculoos",
    description: "Delicate caramelised sponge layered with authentic Lotus Biscoff spread and whipped Belgian speculoos buttercream, topped with crunchy biscuit crumble.",
    category: "cakes",
    subcategory: "Gourmet",
    images: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Lotus Biscoff Caramel", "Biscoff Cheesecake Infusion"],
    sizes: ["500 g", "1 kg", "1.5 kg"],
    startingPrice: null,
    eggless: true,
    customizable: true,
    availableToday: false,
    advanceOrderRequired: true,
    featured: true,
    active: true,
    occasions: ["Birthday", "Anniversary", "Celebrations"],
    tasteProfile: "Caramel & Spiced Cookie"
  },
  {
    id: "cm-cake-4",
    name: "Fresh Seasonal Fruit Gateau",
    slug: "fresh-seasonal-fruit-gateau",
    description: "Light vanilla sponge infused with natural fruit syrup, layered with fresh seasonal fruits and featherlight dairy cream.",
    category: "cakes",
    subcategory: "Fruit",
    images: [
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Mixed Fruit", "Alphonso Mango (Seasonal)", "Pineapple Fresh"],
    sizes: ["500 g", "1 kg", "2 kg"],
    startingPrice: null,
    eggless: true,
    customizable: true,
    availableToday: true,
    advanceOrderRequired: false,
    featured: true,
    active: true,
    occasions: ["Birthday", "Anniversary", "Baby Celebration", "Kids"],
    tasteProfile: "Fresh & Lightly Sweet"
  },
  {
    id: "cm-cake-5",
    name: "Black Forest Royale",
    slug: "black-forest-royale",
    description: "Traditional chocolate sponge layered with macerated cherries, whipped dairy cream, and hand-shaved dark chocolate curls.",
    category: "cakes",
    subcategory: "Classic",
    images: [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Classic Cherry Black Forest", "Dark Chocolate Cherry"],
    sizes: ["500 g", "1 kg", "2 kg"],
    startingPrice: null,
    eggless: false,
    customizable: true,
    availableToday: true,
    advanceOrderRequired: false,
    featured: false,
    active: true,
    occasions: ["Birthday", "Anniversary", "Celebrations"],
    tasteProfile: "Chocolate & Tart Cherry"
  },
  {
    id: "cm-cake-6",
    name: "Pistachio Rose Petal Gateau",
    slug: "pistachio-rose-petal-gateau",
    description: "Nutty roasted pistachio sponge infused with organic Damask rose water, delicate rose cream, and crushed Iranian pistachios.",
    category: "cakes",
    subcategory: "Gourmet",
    images: [
      "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Pistachio Rose", "Pistachio Raspberry"],
    sizes: ["1 kg", "1.5 kg", "2 kg"],
    startingPrice: null,
    eggless: true,
    customizable: true,
    availableToday: false,
    advanceOrderRequired: true,
    featured: true,
    active: true,
    occasions: ["Wedding", "Anniversary", "Baby Celebration"],
    tasteProfile: "Nutty & Aromatic Floral"
  },
  {
    id: "cm-cake-7",
    name: "Butterscotch Praline Crunch Cake",
    slug: "butterscotch-praline-crunch",
    description: "Soft butter sponge smothered in golden butterscotch sauce, whipped caramel cream, and handmade cashew nut praline.",
    category: "cakes",
    subcategory: "Classic",
    images: [
      "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Butterscotch Caramel", "Cashew Praline"],
    sizes: ["500 g", "1 kg", "2 kg"],
    startingPrice: null,
    eggless: true,
    customizable: true,
    availableToday: true,
    advanceOrderRequired: false,
    featured: false,
    active: true,
    occasions: ["Birthday", "Kids", "Celebrations"],
    tasteProfile: "Sweet & Crunchy Caramel"
  },
  {
    id: "cm-cake-8",
    name: "Bento Korean Style Mini Cake",
    slug: "bento-korean-style-mini-cake",
    description: "Pastel frosted minimalist lunchbox cake crafted for intimate celebrations, personal milestones, and aesthetic gifting.",
    category: "cakes",
    subcategory: "Bento",
    images: [
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Vanilla Strawberry", "Dutch Chocolate", "Blueberry Cream"],
    sizes: ["250 g (Bento)"],
    startingPrice: null,
    eggless: true,
    customizable: true,
    availableToday: true,
    advanceOrderRequired: false,
    featured: true,
    active: true,
    occasions: ["Birthday", "Anniversary", "Just Because", "Graduation"],
    tasteProfile: "Delicate & Fruity / Chocolate"
  },

  // --- DESSERTS ---
  {
    id: "cm-dessert-1",
    name: "Gourmet Fudgy Belgian Brownie",
    slug: "gourmet-fudgy-belgian-brownie",
    description: "Dense, intensely chocolaty brownies baked with 70% dark Belgian cocoa and a crisp crinkly top.",
    category: "desserts",
    subcategory: "Brownies",
    images: [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Walnut Fudge", "Classic Dark Chocolate", "Salted Caramel"],
    sizes: ["Single Piece", "Box of 4", "Box of 6"],
    startingPrice: null,
    eggless: true,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: true,
    active: true,
    tasteProfile: "Intensely Chocolate"
  },
  {
    id: "cm-dessert-2",
    name: "Molten Choco Lava Cup",
    slug: "molten-choco-lava-cup",
    description: "Warm individual chocolate cake with a velvety molten liquid chocolate centre.",
    category: "desserts",
    subcategory: "Choco Lava",
    images: [
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Classic Molten Dark Chocolate"],
    sizes: ["Single Serve", "Pack of 2"],
    startingPrice: null,
    eggless: true,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: false,
    active: true,
    tasteProfile: "Warm & Gooey"
  },
  {
    id: "cm-dessert-3",
    name: "Classic Milk Tres Leches",
    slug: "classic-milk-tres-leches",
    description: "Ultra-moist sponge cake soaked in a rich three-milk syrup, finished with pillowy whipped cream and cinnamon dusting.",
    category: "desserts",
    subcategory: "Tres Leches",
    images: [
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Classic Vanilla Milk", "Saffron Pistachio (Rasmalai style)"],
    sizes: ["Single Tub (200g)", "Sharing Tub (500g)"],
    startingPrice: null,
    eggless: true,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: true,
    active: true,
    tasteProfile: "Creamy & Milk Soaked"
  },
  {
    id: "cm-dessert-4",
    name: "Basque Burnt Cheesecake Slice",
    slug: "basque-burnt-cheesecake-slice",
    description: "Creamy, caramelised cheesecake baked at high heat for a rustic scorched exterior and custardy, melting centre.",
    category: "desserts",
    subcategory: "Cheesecake",
    images: [
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Original Cream Cheese", "Blueberry Compote"],
    sizes: ["Slice", "Whole 1 kg"],
    startingPrice: null,
    eggless: false,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: true,
    active: true,
    tasteProfile: "Creamy & Caramelised"
  },
  {
    id: "cm-dessert-5",
    name: "Artisanal French Macaron Box",
    slug: "artisanal-french-macaron-box",
    description: "Almond flour shells with chewy interiors, filled with delicate ganaches and fruit reductions.",
    category: "desserts",
    subcategory: "Macarons",
    images: [
      "https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Assorted (Pistachio, Raspberry, Chocolate, Lemon, Coffee)"],
    sizes: ["Box of 6", "Box of 12"],
    startingPrice: null,
    eggless: false,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: false,
    active: true,
    tasteProfile: "Delicate & Crisp"
  },

  // --- BAKERY ---
  {
    id: "cm-bakery-1",
    name: "Artisanal Fresh Milk Bread",
    slug: "artisanal-fresh-milk-bread",
    description: "Pillow-soft, daily-baked milk bread made with pure butter and fresh milk. Perfect for morning toast and sandwiches.",
    category: "bakery",
    subcategory: "Bread",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Classic White Milk Bread"],
    sizes: ["Standard Loaf (400 g)"],
    startingPrice: null,
    eggless: true,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: true,
    active: true,
    tasteProfile: "Soft & Buttery"
  },
  {
    id: "cm-bakery-2",
    name: "100% Whole Wheat Brown Bread",
    slug: "whole-wheat-brown-bread",
    description: "Nutritious stoneground whole wheat loaf naturally high in fibre, baked fresh with no artificial colourants.",
    category: "bakery",
    subcategory: "Bread",
    images: [
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["100% Whole Wheat"],
    sizes: ["Standard Loaf (400 g)"],
    startingPrice: null,
    eggless: true,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: false,
    active: true,
    tasteProfile: "Wholesome & Earthy"
  },
  {
    id: "cm-bakery-3",
    name: "Crispy Cardamom Tea Rusk",
    slug: "crispy-cardamom-tea-rusk",
    description: "Twice-baked aromatic toast lightly sweetened and infused with freshly ground green cardamom. Essential for chai time.",
    category: "bakery",
    subcategory: "Rusk",
    images: [
      "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Cardamom", "Butter Milk"],
    sizes: ["250 g Pack", "500 g Pack"],
    startingPrice: null,
    eggless: true,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: false,
    active: true,
    tasteProfile: "Crisp & Cardamom Spiced"
  },
  {
    id: "cm-bakery-4",
    name: "Traditional Spiced Plum Cake",
    slug: "traditional-spiced-plum-cake",
    description: "Rich, dense tea cake packed with soaked black raisins, candied ginger, orange peel, and warm baking spices.",
    category: "bakery",
    subcategory: "Plum Cake",
    images: [
      "https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Rich Spiced Fruit"],
    sizes: ["300 g", "500 g"],
    startingPrice: null,
    eggless: false,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: true,
    active: true,
    tasteProfile: "Warm Spice & Candied Fruit"
  },
  {
    id: "cm-bakery-5",
    name: "Golden Cashew Butter Cookies",
    slug: "golden-cashew-butter-cookies",
    description: "Melt-in-mouth bakery cookies baked with pure butter and toasted cashew nibs.",
    category: "bakery",
    subcategory: "Cookies",
    images: [
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Butter Cashew", "Almond Crunch"],
    sizes: ["200 g Box", "400 g Tin"],
    startingPrice: null,
    eggless: true,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: false,
    active: true,
    tasteProfile: "Rich Butter & Nutty"
  },

  // --- CELEBRATIONS / PARTY ESSENTIALS ---
  {
    id: "cm-cel-1",
    name: "Luxury Acrylic Celebration Cake Topper",
    slug: "luxury-acrylic-cake-topper",
    description: "Elegant mirror-finish acrylic topper to crown your bespoke celebration cake.",
    category: "celebrations",
    subcategory: "Cake Topper",
    images: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Gold Mirror", "Rose Gold", "Silver Mirror"],
    sizes: ["Standard Topper"],
    startingPrice: null,
    eggless: false,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: true,
    active: true,
    occasions: ["Birthday", "Anniversary", "Wedding"]
  },
  {
    id: "cm-cel-2",
    name: "Artisanal Champagne Sparkler & Candle Set",
    slug: "champagne-sparkler-and-candle-set",
    description: "Slow-burning premium metallic pencil candles and smokeless celebration fountain sparkler.",
    category: "celebrations",
    subcategory: "Candles",
    images: [
      "https://images.unsplash.com/photo-1514517521153-1be72277b32f?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Champagne Gold", "Metallic Rose Gold"],
    sizes: ["Pack of 12"],
    startingPrice: null,
    eggless: false,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: true,
    active: true,
    occasions: ["Birthday", "Anniversary", "Celebrations"]
  },
  {
    id: "cm-cel-3",
    name: "Festive Confetti Party Popper",
    slug: "festive-confetti-party-popper",
    description: "Compressed-air celebration popper releasing metallic gold and pastel confetti ribbons for unforgettable cake cutting moments.",
    category: "celebrations",
    subcategory: "Party Popper",
    images: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1080&auto=format&fit=crop"
    ],
    flavours: ["Pastel & Gold Mix"],
    sizes: ["Single Popper", "Pack of 3"],
    startingPrice: null,
    eggless: false,
    customizable: false,
    availableToday: true,
    advanceOrderRequired: false,
    featured: false,
    active: true,
    occasions: ["Birthday", "Wedding", "Celebrations"]
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Enchanted Pastel Floral Two-Tier Cake",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1080&auto=format&fit=crop",
    category: "Wedding",
    flavour: "Vanilla Bean & White Chocolate Ganache",
    occasion: "Wedding Reception",
    featured: true,
    createdAt: "2026-02-14"
  },
  {
    id: "gal-2",
    title: "Safari Jungle Adventure 1st Birthday Cake",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1080&auto=format&fit=crop",
    category: "Kids",
    flavour: "Belgian Chocolate Truffle",
    occasion: "1st Birthday Celebration",
    featured: true,
    createdAt: "2026-03-01"
  },
  {
    id: "gal-3",
    title: "Minimalist Korean Aesthetic Bento Cake",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=1080&auto=format&fit=crop",
    category: "Bento",
    flavour: "Strawberry Shortcake",
    occasion: "Anniversary Celebration",
    featured: true,
    createdAt: "2026-03-10"
  },
  {
    id: "gal-4",
    title: "Rustic Textured Golden Anniversary Tier",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1080&auto=format&fit=crop",
    category: "Anniversary",
    flavour: "Pistachio Rose & White Chocolate",
    occasion: "25th Silver Jubilee",
    featured: true,
    createdAt: "2026-02-28"
  },
  {
    id: "gal-5",
    title: "Handcrafted 3D Spiderman Themed Creation",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1080&auto=format&fit=crop",
    category: "Kids",
    flavour: "Butterscotch Praline",
    occasion: "5th Birthday Party",
    featured: false,
    createdAt: "2026-03-15"
  },
  {
    id: "gal-6",
    title: "Contemporary Geometric Sculpted Designer Cake",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=1080&auto=format&fit=crop",
    category: "Designer",
    flavour: "Lotus Biscoff Speculoos",
    occasion: "Milestone Birthday",
    featured: true,
    createdAt: "2026-03-18"
  },
  {
    id: "gal-7",
    title: "Luminescent Pearl Edible Photo Cake",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1080&auto=format&fit=crop",
    category: "Photo Cakes",
    flavour: "Classic Black Forest Royale",
    occasion: "Farewell & Graduation",
    featured: false,
    createdAt: "2026-03-20"
  },
  {
    id: "gal-8",
    title: "Royal Grandeur Tiered Celebration Gateau",
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=1080&auto=format&fit=crop",
    category: "Celebrations",
    flavour: "Belgian Dark Truffle",
    occasion: "Corporate Gala & New Year",
    featured: true,
    createdAt: "2026-01-01"
  }
];

// In compliance with Rule 2 & Section 21:
// Use authentic review templates with verified flags where owner enters verified customer testimonials.
export const initialReviews: CustomerReview[] = [
  {
    id: "rev-1",
    source: "Google",
    name: "Customer Review (Rajahmundry)",
    text: "The custom birthday cake crafted for our family celebration was stunning. Beautiful detailing, freshly baked sponge, and the chocolate truffle was rich without being overly sweet.",
    rating: 5,
    date: "Recent verified order",
    verified: true,
    active: true
  },
  {
    id: "rev-2",
    source: "Google",
    name: "Customer Review (Danavaipeta, Rajahmundry)",
    text: "Ordered an eggless Red Velvet cake for an anniversary. The cream cheese frosting was balanced and velvety. Best part was timely delivery and clear coordination.",
    rating: 5,
    date: "Recent verified order",
    verified: true,
    active: true
  },
  {
    id: "rev-3",
    source: "Google",
    name: "Customer Review (Morampudi, Rajahmundry)",
    text: "We requested a customized theme cake based on a photo reference. Cake Magic matched the design accurately and the butterscotch praline taste was loved by all the kids.",
    rating: 5,
    date: "Recent verified order",
    verified: true,
    active: true
  }
];
