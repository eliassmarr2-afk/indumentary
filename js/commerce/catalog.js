export const categories = [
  { id: "camisetas", label: "Camisetas", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=82" },
  { id: "pantalones", label: "Pantalones", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=500&q=82" },
  { id: "camperas", label: "Camperas", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=82" },
  { id: "gorras", label: "Gorras y Pilusos", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=82" },
  { id: "medias", label: "Medias", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=500&q=82" },
  { id: "botines", label: "Botines", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=82" },
  { id: "pelotas", label: "Pelotas", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=500&q=82" },
];

export const combos = [
  {
    id: "combo-training",
    title: "Combo Training",
    subtitle: "Camiseta técnica + pantalón + medias deportivas.",
    price: 89990,
    compareAt: 112000,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "combo-street",
    title: "Combo Street",
    subtitle: "Campera liviana + jogger para usar dentro y fuera del entrenamiento.",
    price: 124900,
    compareAt: 149500,
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=82",
  },
  {
    id: "combo-match",
    title: "Combo Match Day",
    subtitle: "Camiseta + short + botines para llegar listo a la cancha.",
    price: 159900,
    compareAt: 188000,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=82",
  },
];

export const products = [
  {
    id: "prod-001",
    category: "Camisetas",
    title: "Camiseta Motion",
    subtitle: "Dry fit · corte regular · negro",
    price: 38990,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=84",
  },
  {
    id: "prod-002",
    category: "Camperas",
    title: "Campera Core",
    subtitle: "Liviana · urbana · entrenamiento",
    price: 74990,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=84",
  },
  {
    id: "prod-003",
    category: "Pantalones",
    title: "Jogger Active",
    subtitle: "Tapered fit · algodón técnico",
    price: 56990,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=900&q=84",
  },
  {
    id: "prod-004",
    category: "Botines",
    title: "Botín Vector",
    subtitle: "Cancha · ajuste firme · tracción",
    price: 92990,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=84",
  },
  {
    id: "prod-005",
    category: "Gorras y Pilusos",
    title: "Gorra Pace",
    subtitle: "Liviana · visera curva · negra",
    price: 24990,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=84",
  },
  {
    id: "prod-006",
    category: "Medias",
    title: "Medias Crew Pro",
    subtitle: "Pack x3 · soporte medio",
    price: 19990,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=84",
  },
];

export function searchProducts(query) {
  const normalized = String(query || "").trim().toLocaleLowerCase("es");
  if (!normalized) return products;

  return products.filter((product) =>
    [product.title, product.subtitle, product.category]
      .join(" ")
      .toLocaleLowerCase("es")
      .includes(normalized)
  );
}
