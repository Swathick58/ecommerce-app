import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const user = localStorage.getItem("user");

    const res = await fetch(
      `http://localhost:5000/api/orders/${user}`
    );

    const data = await res.json();
    setOrders(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order, index) => (
          <div key={index}>
            <h3>Total: ₹{order.total}</h3>

            {order.items.map((item, i) => (
              <p key={i}>
                {item.name} - {item.qty}
              </p>
            ))}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;