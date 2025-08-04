import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, setFilter } from "../state/store";

export default function OrderList() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.list);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);
  const filter = useSelector((state) => state.filter);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.size === filter);
  console.log("Orders from redux state:", orders);

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>

      {loading && <p>Loading orders... </p>}
      {error && <p className="error">{error}</p>}

      <ol>
        {filteredOrders.map((order, index) => (
          <li key={index}>
            <div>
              {order.fullName} ordered a size {order.size} with{" "}
              {Array.isArray(order.toppings) && order.toppings.length > 0
                ? `${order.toppings.length} toppings`
                : "no toppings"}
            </div>
          </li>
        ))}
      </ol>
      <div id="sizeFilters">
        Filter by size:
        {["All", "S", "M", "L"].map((size) => {
          const className = `button-filter${size === "All" ? " active" : ""}`;
          return (
            <button
              data-testid={`filterBtn${size}`}
              className={className}
              key={size}
              onClick={() => dispatch(setFilter(size))}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const toppingNames = {
  1: "Pepperoni",
  2: "Green Peppers",
  3: "Pineapple",
  4: "Mushrooms",
  5: "Ham",
};
