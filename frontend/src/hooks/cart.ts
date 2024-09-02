import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../Interfaces";
import { toast } from "react-toastify";

interface State {
  cart: Product[]
  totalPrice: number
}

interface Actions {
  addToCart: (Item: Product, cantidad?: number) => void
  removeFromCart: (Item: Product) => void
  removeProduct: (product: Product) => void
  removeAll: () => void
}

const State = {
  cart: [],
  totalPrice: 0,
}

export const useCartStore = create(persist<State & Actions>((set, get) => ({
  cart: State.cart,
  totalPrice: State.totalPrice,

  removeAll: () => {
    set({
      cart: [],
      totalPrice: 0,
    })
  },
  
  addToCart: (product: Product, cantidad?: number) => {

    if (cantidad && cantidad <= 0) {
      toast.dismiss();
      toast.error("La cantidad debe ser un número mayor que 0");
      return;
    }

    const cart = get().cart
    const cartItem = cart.find(item => item.id === product.id)

    if (cartItem) {
      const updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: (item.quantity as number) + (cantidad || 1) } : item
      )
      set(state => ({
        cart: updatedCart,
        totalPrice: state.totalPrice + Number(product.price) * (cantidad || 1),
      }))
    } else {
      const updatedCart = [...cart, { ...product, quantity: cantidad || 1 }]

      if (cantidad && cantidad > 1) {
        set(state => ({
          cart: updatedCart,
          totalPrice: state.totalPrice + Number(product.price) * cantidad,
        }))
      } else {
        set(state => ({
          cart: updatedCart,
          totalPrice: state.totalPrice + Number(product.price),
        }))
      }
    }
  },

  removeFromCart: (product: Product) => {
    const cart = get().cart
    const cartItem = cart.find(item => item.id === product.id)

    if (cartItem && cartItem.quantity && cartItem.quantity > 1) {
      const updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: (item.quantity as number) - 1 } : item
      )
      set(state => ({
        cart: updatedCart,
        totalPrice: Math.max(state.totalPrice - Number(product.price), 0),
      }))
    } else if (cartItem && cartItem.quantity === 1) {

      toast.dismiss();
      toast.warning("Cuidado, no puedes restar más la cantidad de este producto.")
    } else {
      const totalPrice = get().totalPrice - Number(product.price) * (product.quantity || 1);
      set(state => ({
        cart: state.cart.filter(item => item.id !== product.id),
        totalPrice: Math.max(totalPrice, 0),
      }))
    }
  },

  removeProduct: (product: Product) => {
    const totalPrice = get().totalPrice - Number(product.price) * (product.quantity || 1);
    set(state => ({
      cart: state.cart.filter(item => item.id !== product.id),
      totalPrice: Math.max(totalPrice, 0),
    }))
  },
}),

  {
    name: "cart-storage",
  }

))