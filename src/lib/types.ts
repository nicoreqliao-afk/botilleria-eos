export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image: string | null;
  available: boolean;
  featured: boolean;
  categoryName?: string;
  categorySlug?: string;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  blurb: string | null;
  coverImage: string | null;
  productCount: number;
  products: ProductDTO[];
};
