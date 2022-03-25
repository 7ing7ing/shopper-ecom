export const initialState = {
  cart: [],
  wishlist: [],
  orders: [],
};

export const getCartTotal = (basket) =>
  //array.reduce(function(total, currentValue), initialValue)
  basket?.reduce((amount, item) => item.price + amount, 0);

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      //In the header component, localStorage is used to retrieve the state. In here, with each dispatch case, localStorage is updating at the same time as the state.
      localStorage.setItem(
        "cart",
        JSON.stringify([...state.cart, action.item])
      );

      return {
        ...state,
        cart: [...state.cart, action.item], //This is concatenating the previous basket array with the new item. The new item is added to the basket array.
      };
    case "ADD_TO_WISHLIST":
      localStorage.setItem(
        "wishlist",
        JSON.stringify([...state.wishlist, action.item])
      );
      return {
        ...state,
        wishlist: [...state.wishlist, action.item],
      };
    case "REMOVE_FROM_CART":
      const index = state.cart.findIndex(
        (cartItem) => cartItem.id === action.id
      );
      let newCart = [...state.cart];

      if (index >= 0) {
        newCart.splice(index, 1);
      } else {
        console.warn(
          `Can't remove product (id: ${action.id}) as it's not in basket! `
        );
      }

      localStorage.setItem("cart", JSON.stringify(newCart));

      return {
        ...state,
        cart: newCart,
      };
    case "REMOVE_FROM_WISHLIST":
      const indexWish = state.wishlist.findIndex(
        (wishlistItem) => wishlistItem.id === action.id
      );
      let newWishlist = [...state.wishlist];

      if (indexWish >= 0) {
        newWishlist.splice(indexWish, 1);
      } else {
        console.warn(
          `Can't remove product (id: ${action.id}) as it's not in wishlist! `
        );
      }

      localStorage.setItem("wishlist", JSON.stringify(newWishlist));

      return {
        ...state,
        wishlist: newWishlist,
      };

    case "EMPTY_CART":
      localStorage.setItem("cart", JSON.stringify([]));

      return {
        ...state,
        cart: [],
      };

    case "EMPTY_WISHLIST":
      localStorage.setItem("wishlist", JSON.stringify([]));

      return {
        ...state,
        wishlist: [],
      };

    default:
      return state;
  }
};

export default reducer;
