import React, { useReducer, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchOrders } from "../state/store";

const initialFormState = {
  // suggested
  fullName: "",
  size: "",
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "CHANGE_INPUT":
      return { ...state, [action.name]: action.value };
    case "TOGGLE_TOPPING":
      return { ...state, [action.name]: !state[action.name] };
    case "RESET":
      return initialFormState;
    default:
      return state;
  }
}

export default function PizzaForm() {
  const [state, dispatch] = useReducer(reducer, initialFormState);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const reduxDispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      dispatch({ type: "TOGGLE_TOPPING", name });
    } else {
      dispatch({ type: "CHANGE_INPUT", name, value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage("");

    const toppings = Object.keys(state).filter(
      (key) => ["1", "2", "3", "4", "5"].includes(key) && state[key]
    );

    const order = {
      fullName: state.fullName,
      size: state.size,
      toppings,
    };

    axios
      .post("http://localhost:9009/api/pizza/order", order)
      .then(() => {
        setIsPending(false);
        dispatch({ type: "RESET" });
        reduxDispatch(fetchOrders()); 
      })

      .catch((err) => {
        setIsPending(false);
        const message = err.response?.data?.message;
        if (message) {
          setErrorMessage(message);
        } else {
          setErrorMessage("Something went wrong");
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pizza Form</h2>

      {isPending && <div className="pending">Order in progress...</div>}
      {errorMessage && (
        <div className="failure">Order failed: {errorMessage}</div>
      )}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            data-testid="fullNameInput"
            id="fullName"
            name="fullName"
            placeholder="Type full name"
            type="text"
            value={state.fullName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label>
          <br />
          <select
            data-testid="sizeSelect"
            id="size"
            name="size"
            value={state.size}
            onChange={handleChange}
          >
            <option value="">----Choose size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        <div className="input-group">
          <label>
            <input
              data-testid="checkPepperoni"
              type="checkbox"
              name="1"
              checked={state["1"]}
              onChange={handleChange}
            />
            Pepperoni
            <br />
          </label>
          <label>
            <input
              data-testid="checkGreenpeppers"
              type="checkbox"
              name="2"
              checked={state["2"]}
              onChange={handleChange}
            />
            Green Peppers
            <br />
          </label>
          <label>
            <input
              data-testid="checkPineapple"
              type="checkbox"
              name="3"
              checked={state["3"]}
              onChange={handleChange}
            />
            Pineapple
            <br />
          </label>
          <label>
            <input
              data-testid="checkMushrooms"
              type="checkbox"
              name="4"
              checked={state["4"]}
              onChange={handleChange}
            />
            Mushrooms
            <br />
          </label>
          <label>
            <input
              data-testid="checkHam"
              type="checkbox"
              name="5"
              checked={state["5"]}
              onChange={handleChange}
            />
            Ham
            <br />
          </label>
        </div>
      </div>

      <input data-testid="submit" type="submit" />
    </form>
  );
}

const toppingLabels = {
  1: "Pepperoni",
  2: "Green Peppers",
  3: "Pineapple",
  4: "Mushrooms",
  5: "Ham",
};
