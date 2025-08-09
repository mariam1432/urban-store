import React from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  image: string;
  id: number;
  title: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  id,
  title,
  price,
}) => {
  return (
    <Link
      to={`/product/${id}`}
      className="group block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-opacity-75"
      aria-label={`View ${title} - $${price}`}
    >
      {/* Image Container with Aspect Ratio */}
      <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={`${title} product image`}
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          width={300}
          height={300}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/300x300?text=Product+Image";
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h2 className="font-semibold text-sm sm:text-base line-clamp-2 mb-1">
          {title}
        </h2>
        <p className="font-bold text-lg text-gray-900">
          ${price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
