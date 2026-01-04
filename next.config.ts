import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/shop", destination: "/boutique", permanent: true },
      { source: "/product/:id", destination: "/produit/:id", permanent: true },
      { source: "/cart", destination: "/panier", permanent: true },
      { source: "/about", destination: "/a-propos", permanent: true },
      { source: "/search", destination: "/recherche", permanent: true },
      { source: "/categories/indoor-plants", destination: "/categories/plantes-interieur", permanent: true },
      { source: "/categories/outdoor-plants", destination: "/categories/plantes-exterieur", permanent: true },
      { source: "/categories/accessories", destination: "/categories/accessoires", permanent: true },
      { source: "/categories/care-products", destination: "/categories/produits-entretien", permanent: true },
    ]
  },
};

export default nextConfig;
