import React from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
}

interface ProductGridProps {
  title?: string;
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ title, products }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      {title && (
        <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition-all cursor-pointer overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover hover:scale-110 transition-transform duration-500"
            />
            <div className="p-3">
              <h3 className="text-base font-semibold text-gray-800 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
