import {
	createContext,
	useState,
	useContext,
	useCallback,
	useEffect
} from 'react';
import {
	CartProductType,
	PriceType
} from '@/app/product/[productId]/ProductDetail';
import { toast } from 'react-hot-toast';

type CartContextType = {
	cartTotalQty: number;
	cartProducts: CartProductType[] | null;
	cartTotalAmount: number;
	paymentIntent: string | null;
	handleAddProductToCart: (
		product: CartProductType,
		currentPrice: PriceType
	) => void;
	handleRemoveProductFromCart: (product: CartProductType) => void;
	handleCartQtyIncrease: (product: CartProductType) => void;
	handleCartQtyDecrease: (product: CartProductType) => void;
	handleClearCart: () => void;
	handleSetPaymentIntent: (val: string | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
	[propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
	const [cartTotalQty, setCartTotalQty] = useState(0);
	const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
		null
	);
	const [cartTotalAmount, setCartTotalAmount] = useState(0);
	const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

	useEffect(() => {
		const cartItems: any = localStorage.getItem('eShopCartItems');
		const cProducts: CartProductType[] | null = JSON.parse(cartItems);
		const paymentIntent: string | null =
			localStorage.getItem('eShopPaymentIntent');

		setCartProducts(cProducts);
		setPaymentIntent(paymentIntent);
	}, []);

	useEffect(() => {
		const getTotal = () => {
			if (cartProducts) {
				const { total, qty } = cartProducts.reduce(
					(acc, item) => {
						const itemTotal = item.price.price * item.quantity;
						acc.total += itemTotal;
						acc.qty += item.quantity;

						return acc;
					},
					{
						total: 0,
						qty: 0
					}
				);
				setCartTotalQty(qty);
				setCartTotalAmount(total);
			}
		};
		getTotal();
	}, [cartProducts]);

	const handleAddProductToCart = useCallback(
		(product: CartProductType, currentPrice: PriceType) => {
			const productData = { ...product, price: currentPrice };
			let updatedCart;
			if (!cartProducts) {
				updatedCart = [productData];
			} else {
				let index = cartProducts.findIndex(
					(item) =>
						item.id === productData.id &&
						item.price.price === productData.price.price
				);
				console.log('index', index);
				if (index > -1) {
					updatedCart = [...cartProducts];
					updatedCart[index].quantity = ++updatedCart[index].quantity;
				} else {
					updatedCart = [...cartProducts, productData];
				}
			}

			toast.success('Product added to cart');

			localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart));
			setCartProducts(updatedCart);
		},
		[cartProducts]
	);

	const handleRemoveProductFromCart = useCallback(
		(product: CartProductType) => {
			if (cartProducts) {
				let index = cartProducts.findIndex(
					(item) =>
						item.id === product.id && item.price.price === product.price.price
				);
				let updatedCart = [...cartProducts];
				updatedCart.splice(index, 1);
				toast.success('Product removed from cart');
				localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart));
				setCartProducts(updatedCart);
			}
		},
		[cartProducts]
	);

	const handleCartQtyIncrease = useCallback(
		(product: CartProductType) => {
			if (product.quantity === 99) {
				return toast.error('Maximum quantity reached');
			}
			let updatedCart;
			if (cartProducts) {
				const existingIndex = cartProducts.findIndex(
					(item) => item.id === product.id
				);
				if (existingIndex > -1) {
					updatedCart = [...cartProducts];
					updatedCart[existingIndex].quantity = ++updatedCart[existingIndex]
						.quantity;
					setCartProducts(updatedCart);
					localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart));
				}
			}
		},
		[cartProducts]
	);

	const handleCartQtyDecrease = useCallback(
		(product: CartProductType) => {
			let updatedCart;
			if (cartProducts) {
				const existingIndex = cartProducts.findIndex(
					(item) => item.id === product.id
				);
				if (existingIndex > -1) {
					updatedCart = [...cartProducts];
					updatedCart[existingIndex].quantity = --updatedCart[existingIndex]
						.quantity;
					setCartProducts(updatedCart);
					localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart));
				}
			}
		},
		[cartProducts]
	);

	const handleClearCart = useCallback(() => {
		setCartProducts(null);
		setCartTotalQty(0);
		localStorage.setItem('eShopCartItems', JSON.stringify(null));
	}, []);

	const handleSetPaymentIntent = useCallback((val: string | null) => {
		setPaymentIntent(val);
		localStorage.setItem('eShopPaymentIntent', JSON.stringify(val));
	}, []);

	const value = {
		cartTotalQty,
		cartProducts,
		cartTotalAmount,
		paymentIntent,
		handleAddProductToCart,
		handleRemoveProductFromCart,
		handleCartQtyIncrease,
		handleCartQtyDecrease,
		handleClearCart,
		handleSetPaymentIntent
	};

	return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (context === null) {
		throw new Error('useCart must be used within a CartContextProvider');
	}
	return context;
};
