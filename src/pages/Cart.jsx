import { useEffect, useState } from "react";
import axios from "axios";

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/cart/123"); // Replace 123 with the actual cart ID
        if (response.data && response.data.data) {
          setCart(response.data.data);
        } else {
          setError("No cart found.");
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []); // Fetch cart on component mount

  const handleRemoveFromCart = async (productId) => {
    try {
      const updatedProducts = cart.products.filter(item => item.product._id !== productId);
      const response = await axios.put(
        `http://localhost:5000/api/v1/cart/update/${cart._id}`,
        { products: updatedProducts },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCart(response.data.data);
    } catch (err) {
      console.error("Error removing product:", err);
      setError("Failed to remove product from cart.");
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const updatedProducts = cart.products.map(item => 
        item.product._id === productId ? { ...item, quantity } : item
      );
      const response = await axios.put(
        `http://localhost:5000/api/v1/cart/update/${cart._id}`,
        { products: updatedProducts },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCart(response.data.data);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update product quantity.");
    }
  };

  if (loading) {
    return <h2 className="text-center text-blue-700">Loading cart...</h2>;
  }

  if (error) {
    return <h2 className="text-center text-red-600">{error}</h2>;
  }

  return (
    <div className="container mx-auto p-6 bg-[#f8f4e1]">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">Your Cart</h1>

      {cart.products.length === 0 ? (
        <p className="text-center text-red-600">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.products.map((item) => (
            <div key={item.product._id} className="cart-item bg-white shadow-lg rounded-lg overflow-hidden mb-4">
              <div className="p-4 flex items-center">
                <img
                  src={item.product.pictures[0]} // Display the first image of the product
                  alt={item.product.name}
                  className="w-24 h-24 object-cover mr-4"
                />
                <div className="flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-blue-800">{item.product.name}</h2>
                  <p className="text-sm text-gray-700 mt-2">{item.product.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                        className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-300"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.product._id, parseInt(e.target.value))}
                        className="w-12 text-center border p-2 rounded-md"
                      />
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                        className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-300"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-lg font-bold text-blue-900 mt-4">${item.product.price * item.quantity}</p>
                    <button
                      onClick={() => handleRemoveFromCart(item.product._id)}
                      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="total-price flex justify-between items-center mt-6">
            <h2 className="text-2xl font-bold text-blue-800">Total Price:</h2>
            <p className="text-lg font-bold text-blue-900">${cart.total_price}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
