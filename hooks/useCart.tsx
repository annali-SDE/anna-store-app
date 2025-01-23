import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartProductType } from '@/app/product/[productId]/ProductDetail';

interface CartStore {
	cartTotalQty: number;
	cartItems: CartProductType[];
	cartTotalAmount: number;
	paymentIntentId: string | null;
	addItem: (item: CartProductType) => void;
	removeItem: (idToRemove: CartProductType) => void;
	increaseQuantity: (itemToIncrease: CartProductType) => void;
	decreaseQuantity: (itemToDecrease: CartProductType) => void;
	setPaymentIntentId: (id: string | null) => void;
	clearCart: () => void;
}

export const useCart = create(
	persist<CartStore>(
		(set, get) => ({
			cartTotalQty: 0,
			cartItems: [],
			cartTotalAmount: 0,
			paymentIntentId: null,
			addItem: (item: CartProductType) => {
				const currentItems = get().cartItems;
				const isExisting = currentItems.find(
					(cartItem) =>
						cartItem.id === item.id &&
						cartItem.price.price === item.price.price &&
						cartItem.price.unit === item.price.unit &&
						cartItem.selectedImg.color === item.selectedImg.color
				);

				if (isExisting) {
					return toast('Item already in cart');
				}

				const cartItems = [...currentItems, item];
				let cartTotalQty = 0;
				let cartTotalAmount = 0;

				if (cartItems.length === 1) {
					cartTotalQty = item.quantity;
					cartTotalAmount = item.price.price * item.quantity;
				} else {
					cartItems.forEach((cartItem) => {
						cartTotalQty += cartItem.quantity;
						cartTotalAmount += cartItem.price.price * cartItem.quantity;
					});
				}
				set({
					cartItems,
					cartTotalQty,
					cartTotalAmount
				});

				toast.success('Item added to cart', { icon: '🛒' });
			},
			removeItem: (idToRemove: CartProductType) => {
				const currentItems = get().cartItems;
				let index = currentItems.findIndex(
					(cartProducts) =>
						cartProducts.id === idToRemove.id &&
						cartProducts.price.price === idToRemove.price.price &&
						cartProducts.selectedImg.color === idToRemove.selectedImg.color
				);
				let updatedCart = [...currentItems];
				updatedCart.splice(index, 1);
				const currentTotalQty = get().cartTotalQty;
				const newTotalQty = currentTotalQty - idToRemove.quantity;
				const currentTotalAmount = get().cartTotalAmount;
				const newTotalAmount =
					currentTotalAmount - idToRemove.price.price * idToRemove.quantity;
				set({
					cartItems: updatedCart,
					cartTotalQty: newTotalQty,
					cartTotalAmount: newTotalAmount
				});
				toast.success('Item removed from cart');
			},
			increaseQuantity: (itemToIncrease: CartProductType) => {
				const newCartItems = get().cartItems.map((cartItem) =>
					cartItem.id === itemToIncrease.id &&
					cartItem.price.price === itemToIncrease.price.price &&
					cartItem.selectedImg.color === itemToIncrease.selectedImg.color
						? {
								...cartItem,
								quantity: cartItem.quantity + 1
						  }
						: cartItem
				);
				const currentTotalQty = get().cartTotalQty;
				const newTotalQty = currentTotalQty + 1;
				const currentTotalAmount = get().cartTotalAmount;
				const newTotalAmount = currentTotalAmount + itemToIncrease.price.price;
				set({
					cartItems: newCartItems,
					cartTotalQty: newTotalQty,
					cartTotalAmount: newTotalAmount
				});
			},
			decreaseQuantity: (itemToDecrease: CartProductType) => {
				if (itemToDecrease.quantity === 1) {
					toast.error('Item quantity cannot be less than 1');
					return;
				}
				const newCartItems = get().cartItems.map((cartItem) => {
					if (
						cartItem.id === itemToDecrease.id &&
						cartItem.price.price === itemToDecrease.price.price &&
						cartItem.selectedImg.color === itemToDecrease.selectedImg.color
					) {
						if (cartItem.quantity === 1) {
							toast.error('Item quantity cannot be less than 1');
						} else if (cartItem.quantity > 1) {
							return { ...cartItem, quantity: cartItem.quantity - 1 };
						}
					}
					return cartItem;
				});

				const currentTotalQty = get().cartTotalQty;
				const newTotalQty = currentTotalQty - 1;
				const currentTotalAmount = get().cartTotalAmount;
				const newTotalAmount = currentTotalAmount - itemToDecrease.price.price;
				set({
					cartItems: newCartItems,
					cartTotalQty: newTotalQty,
					cartTotalAmount: newTotalAmount
				});
			},
			setPaymentIntentId: (paymentIntentId: string | null) => {
				set({ paymentIntentId: paymentIntentId });
			},

			// createPaymentIntent: async () => {
			// 	const strip = new Strip(process.env.STRIPE_SECRET_KEY as string, {
			// 		apiVersion: '2024-10-28.acacia'
			// 	});
			// 	const currentTotalQty = get().cartTotalQty;
			// 	const paymentIntent = await strip.paymentIntents.create({
			// 		amount: Math.round(currentTotalQty * 100),
			// 		currency: 'usd',
			// 		automatic_payment_methods: { enabled: true }
			// 	});
			// 	set({ paymentIntentId: paymentIntent.id });
			// },

			clearCart: () => {
				set({
					cartItems: [],
					cartTotalQty: 0,
					cartTotalAmount: 0
					// paymentIntentId: null
				});
			}
		}),
		{
			name: 'cart-storage',
			storage: createJSONStorage(() => localStorage)
		}
	)
);
