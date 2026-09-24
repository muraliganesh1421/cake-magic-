import { notFound } from "next/navigation";
import { Metadata } from "next";
import { store } from "@/lib/store";
import ProductDetailView from "@/components/product/ProductDetailView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = store.getProductBySlug(slug);
  if (!product) {
    return { title: "Cake Not Found | Cake Magic Rajahmundry" };
  }

  return {
    title: `${product.name} | Cake Magic Rajahmundry`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Bespoke Cakes Rajahmundry`,
      description: product.description,
      images: product.images.map((img) => ({ url: img })),
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = store.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products from the same category
  const allProducts = store.getProducts();
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id && p.active)
    .slice(0, 3);

  // Schema.org Product structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: "Cake Magic",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.startingPrice || 0,
      availability: product.availableToday
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full bg-[var(--background)]">
        <ProductDetailView product={product} relatedProducts={related} />
      </div>
    </>
  );
}
