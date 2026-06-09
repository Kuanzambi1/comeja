const foodImages: Record<string, string> = {
  "burger king": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=250&fit=crop",
  "pizza hut": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop",
  "sushi house": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=250&fit=crop",
};

const productImages: Record<string, string> = {
  whopper: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
  "batata frita": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop",
  "coca-cola": "https://images.unsplash.com/photo-1629203851122-3726ec8f81e2?w=200&h=200&fit=crop",
  "milk shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop",
  "combo whopper": "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop",
  "pizza calabresa": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop",
  "pizza marguerita": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop",
  brownie: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=200&fit=crop",
  "combinado 20": "https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&h=200&fit=crop",
  uramaki: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=200&fit=crop",
  temaki: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200&h=200&fit=crop",
  "hot roll": "https://images.unsplash.com/photo-1579820010410-c10411aaaa88?w=200&h=200&fit=crop",
};

const fallbackFood = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop";
const fallbackProduct = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop";
const fallbackBanner = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop";

export function getRestaurantImage(nome: string): string {
  const key = nome.toLowerCase();
  for (const [name, url] of Object.entries(foodImages)) {
    if (key.includes(name)) return url;
  }
  return fallbackFood;
}

export function getProductImage(nome: string): string {
  const key = nome.toLowerCase();
  for (const [name, url] of Object.entries(productImages)) {
    if (key.includes(name)) return url;
  }
  return fallbackProduct;
}

export function getRandomFoodImage(seed: number): string {
  const images = Object.values(foodImages);
  return images[seed % images.length] || fallbackFood;
}

const heroImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=600&fit=crop",
];

export function getHeroImage(index: number): string {
  return heroImages[index % heroImages.length];
}
