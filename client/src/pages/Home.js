import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // Load products + Razorpay script
  useEffect(() => {
    fetchProducts();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  // Add product
  const addProduct = async () => {
    if (!name || !price) {
      alert("Enter product details");
      return;
    }

    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price }),
    });

    setName("");
    setPrice("");
    fetchProducts();
  };

  // Add to cart with quantity
  const addToCart = (product) => {
    const exist = cart.find((item) => item._id === product._id);

    if (exist) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Increase qty
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // Decrease qty
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // Total price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // Payment
  const handlePayment = async () => {
    if (totalPrice === 0) {
      alert("Cart is empty ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalPrice }),
      });

      const data = await res.json();

      const options = {
        key: "rzp_test_Sd0veXHTykAq7U", // ✅ your key
        amount: data.amount,
        currency: "INR",
        name: "MyShop",
        description: "Order Payment",
        order_id: data.id,

        handler: async function (response) {
          try {
            alert("Payment Successful 🎉");

            await fetch("http://localhost:5000/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: localStorage.getItem("user"),
                items: cart,
                total: totalPrice,
              }),
            });

            setCart([]);
          } catch (err) {
            alert("Order save failed ❌");
          }
        },

        prefill: {
          email: localStorage.getItem("user"),
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");
    }
  };

  return (
    <div style={{ fontFamily: "Arial" }}>
      
      {/* Navbar */}
      <div style={{
        background: "#222",
        color: "white",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <h2>🛒 MyShop</h2>

        <div>
          <button
            onClick={() => navigate("/orders")}
            style={{ marginRight: "10px" }}
          >
            Orders
          </button>

          <button
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "8px"
            }}
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: "20px" }}>

        {/* Add Product */}
        <h2>Add Product</h2>

        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button onClick={addProduct}>Add</button>

        {/* Products */}
        <h2 style={{ marginTop: "20px" }}>Products</h2>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {products.map((p) => (
            <div key={p._id} style={{ border: "1px solid #ddd", padding: "10px" }}>
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>

        {/* Cart */}
        <h2 style={{ marginTop: "20px" }}>Cart</h2>

        {cart.map((item) => (
          <div key={item._id}>
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
            <p>Qty: {item.qty}</p>

            <button onClick={() => increaseQty(item._id)}>+</button>
            <button onClick={() => decreaseQty(item._id)}>-</button>
          </div>
        ))}

        <h3>Total: ₹{totalPrice}</h3>

        <button
          style={{
            background: "orange",
            color: "white",
            padding: "10px",
            border: "none"
          }}
          onClick={handlePayment}
        >
          Pay ₹{totalPrice}
        </button>

      </div>
    </div>
  );
}

export default Home;