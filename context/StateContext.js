import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const useStateContext = () => useContext(Context);

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct = null;
  //functions
  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );
    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantity) => prevTotalQuantity + quantity);
    if (checkProductInCart) {
      //   const updatedCartItems = cartItems.map((cartProduct) => {
      //     if (cartProduct._id === product._id)
      //       return {
      //         ...cartProduct,
      //         quantity: cartProduct.quantity + quantity,
      //       };
      //   });
      //   setCartItems(updatedCartItems);
      setCartItems((prevCartItmes) =>
        prevCartItmes.map((cartProduct) =>
          cartProduct._id !== product._id
            ? cartProduct
            : {
                ...cartProduct,
                quantity: cartProduct.quantity + quantity,
              }
        )
      );
    } else {
      product.quantity = quantity;

      setCartItems((prevCartItmes) => [...prevCartItmes, { ...product }]);
    }
    toast.success(`${qty} ${product.name} added to the cart.`);
    setQty(1);
  };
  const onRemove = (id) => {
    foundProduct = cartItems.find((item) => item._id === id);

    setCartItems((prevCartItmes) =>
      prevCartItmes.filter((item) => item._id !== id)
    );
    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
  };
  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    // index = cartItems.findIndex((item) => item.id === id);
    console.log(foundProduct);
    switch (value) {
      case "inc":
        // foundProduct.quantity++;
        setCartItems((prevCartItmes) =>
          prevCartItmes.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
        setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        break;
      case "dec":
        if (!foundProduct?.quantity) return;
        if (foundProduct.quantity === 1) return onRemove(id);
        setCartItems((prevCartItmes) =>
          prevCartItmes.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
        break;
    }
  };
  const incQty = () => setQty((prevQty) => prevQty + 1);
  const decQty = () =>
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  const openCart = () => setShowCart(true);
  const closeCart = () => setShowCart(false);
  const resetState = () => {
    localStorage.clear();
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    setQty(1);
  };
  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        openCart,
        closeCart,
        toggleCartItemQuantity,
        onRemove,
        resetState,
      }}
    >
      {children}
    </Context.Provider>
  );
};
