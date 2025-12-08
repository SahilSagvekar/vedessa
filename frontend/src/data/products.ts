// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   rating: number;
//   reviews: number;
//   category: string;
//   collection?: string;
//   isNew?: boolean;
//   image: string;
// }

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  is_new: boolean;
  is_bestseller: boolean;
  stock: number;
  category_name?: string;
  category_slug?: string;
  collection_name?: string;
  collection_slug?: string;
  created_at?: string;
  updated_at?: string;
}

// For components that need category/collection info
export interface Category {
  id: string;
  name: string;
  slug: string;
  product_count: number;
  created_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  image?: string;
  product_count: number;
  created_at: string;
}


export const products: Product[] = [
  {
    id: "1",
    name: "Ashwaras Body Massage Oil",
    description: "Nourished Skin and Relaxed Mind",
    price: 2295,
    rating: 4.9,
    reviews: 134,
    category: "bath_body",
    collection: "ashwaras",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=500&fit=crop"
  },
  {
    id: "2",
    name: "Pure Rose Water Facial Toner",
    description: "Refreshing & Balancing Toner",
    price: 895,
    rating: 4.7,
    reviews: 312,
    category: "skincare",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop"
  },
  {
    id: "3",
    name: "Eladhi Nourishing Rich Cream",
    description: "Barrier Repair Cream With Cardamom, Aloe Vera & Glycerin",
    price: 3125,
    rating: 4.8,
    reviews: 112,
    category: "skincare",
    collection: "eladhi",
    isNew: true,
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400&h=500&fit=crop"
  },
  {
    id: "4",
    name: "Rejuvenating & Brightening Ayurvedic Night Cream",
    description: "For Radiant Morning Skin",
    price: 2850,
    rating: 4.9,
    reviews: 178,
    category: "skincare",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=500&fit=crop"
  },
  {
    id: "5",
    name: "Bringaras Hydrating Conditioner",
    description: "For Balanced Scalp & Shiny Hair",
    price: 2195,
    rating: 4.7,
    reviews: 89,
    category: "haircare",
    collection: "bringaras",
    isNew: true,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=500&fit=crop"
  },
  {
    id: "6",
    name: "Bringaraj Hair Oil",
    description: "Promotes Hair Growth & Prevents Premature Greying",
    price: 1295,
    rating: 4.8,
    reviews: 245,
    category: "haircare",
    collection: "bringaras",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=500&fit=crop"
  },
  {
    id: "7",
    name: "Saffron & Sandalwood Luxurious Gift Set",
    description: "Premium Ayurvedic Gifting Collection",
    price: 5995,
    rating: 5,
    reviews: 67,
    category: "gifting",
    image: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=400&h=500&fit=crop"
  },
  {
    id: "8",
    name: "Eladhi Hydrating Fresh Emulsion",
    description: "Lightweight Cream For Dewy Skin",
    price: 3025,
    rating: 4.9,
    reviews: 156,
    category: "skincare",
    collection: "eladhi",
    isNew: true,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop"
  },
  {
    id: "9",
    name: "Kumkumadi Brightening Ayurvedic Face Scrub",
    description: "Gentle Exfoliation For Glowing Skin",
    price: 1895,
    rating: 4.6,
    reviews: 198,
    category: "skincare",
    collection: "kumkumadi",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=500&fit=crop"
  },
  {
    id: "10",
    name: "Rose & Jasmine Face Cleanser",
    description: "Gentle Daily Cleansing",
    price: 1650,
    rating: 4.8,
    reviews: 276,
    category: "skincare",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=500&fit=crop"
  },
  {
    id: "11",
    name: "Ashwaras Replenishing Body Oil",
    description: "Leave In Body Oil For Daily Use",
    price: 3395,
    rating: 4.8,
    reviews: 45,
    category: "bath_body",
    collection: "ashwaras",
    isNew: true,
    image: "https://images.unsplash.com/photo-1600428877878-1a0ff561f78a?w=400&h=500&fit=crop"
  },
  {
    id: "12",
    name: "Eladhi Restorative Face & Body Oil",
    description: "After Bath Oil For Smooth Skin",
    price: 2050,
    rating: 4.7,
    reviews: 98,
    category: "skincare",
    collection: "eladhi",
    isNew: true,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=500&fit=crop"
  },
  {
    id: "13",
    name: "Bringaras Purifying Scalp Scrub",
    description: "Eliminates Buildup For Scalp & Mind Refreshment",
    price: 3195,
    rating: 4.8,
    reviews: 67,
    category: "haircare",
    collection: "bringaras",
    isNew: true,
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=500&fit=crop"
  },
  {
    id: "14",
    name: "Kumkumadi Youth-Illuminating Silky Serum",
    description: "The Botanical Alternative to Vitamin C",
    price: 2695,
    rating: 5,
    reviews: 23,
    category: "skincare",
    collection: "kumkumadi",
    isNew: true,
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=400&h=500&fit=crop"
  },
  {
    id: "15",
    name: "Bringaras Regenerating Hair Mask",
    description: "For Balanced Scalp & Shiny Hair",
    price: 1525,
    rating: 4.9,
    reviews: 128,
    category: "haircare",
    collection: "bringaras",
    isNew: true,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop"
  },
  {
    id: "16",
    name: "Bringaras Smoothing Hair Serum",
    description: "For Frizz-Free Lustrous Hair",
    price: 3125,
    rating: 4.7,
    reviews: 54,
    category: "haircare",
    collection: "bringaras",
    isNew: true,
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=400&h=500&fit=crop"
  }
];

export const collections = [
  { id: "skincare", name: "Skincare", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop" },
  { id: "haircare", name: "HairCare", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop" },
  { id: "bringaras", name: "Bringaras Collection", image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300&h=300&fit=crop" },
  { id: "eladhi", name: "Eladhi Collection", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop" },
  { id: "ashwaras", name: "Ashwaras Collection", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop" },
  { id: "kumkumadi", name: "Kumkumadi Collection", image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=300&h=300&fit=crop" },
  { id: "gifting", name: "Gifting", image: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=300&h=300&fit=crop" },
  { id: "bath_body", name: "Bath and Body", image: "https://images.unsplash.com/photo-1600428877878-1a0ff561f78a?w=300&h=300&fit=crop" },
  { id: "bestsellers", name: "Bestsellers", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop" },
  { id: "shop", name: "Shop", image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300&h=300&fit=crop" },
];