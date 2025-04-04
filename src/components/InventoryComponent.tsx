import { useState, useEffect } from "react";
import { Product, listenToProduct, updateStock } from "../services/inventoryService";

interface InventoryProps {
  productId: string;
}

const InventoryComponent: React.FC<InventoryProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const unsubscribe = listenToProduct(productId, setProduct);
    return () => unsubscribe();
  }, [productId]);

  const handleUpdateStock = async () => {
    if (product && product.stock > 0) {
      await updateStock(productId, product.stock - 1);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      {product ? (
        <>
          <h2 className="text-lg font-bold">{product.name}</h2>
          <p>Stock: {product.stock}</p>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            onClick={handleUpdateStock}
            disabled={product.stock <= 0}
          >
            Sell 1 Item
          </button>
        </>
      ) : (
        <p>Loading product...</p>
      )}
    </div>
  );
};

export default InventoryComponent;
