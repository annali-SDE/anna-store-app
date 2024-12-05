import {
	LayoutDashboard,
	Shapes,
	ShoppingBag,
	Tag,
	Store,
	UsersRound
} from 'lucide-react';

// export const navLinks = [
// 	{
// 		url: '/admin',
// 		icon: <LayoutDashboard />,
// 		label: 'Dashboard'
// 	},
// 	{
// 		url: '/admin/collections',
// 		icon: <Shapes />,
// 		label: 'Collections'
// 	},
// 	{
// 		url: '/admin/products',
// 		icon: <Tag />,
// 		label: 'Products'
// 	},
// 	{
// 		url: '/admin/orders',
// 		icon: <ShoppingBag />,
// 		label: 'Orders'
// 	},
// 	{
// 		url: '/admin/customers',
// 		icon: <UsersRound />,
// 		label: 'Customers'
// 	}
// ];
export const navLinks = [
	{
		url: '/admin',
		icon: <LayoutDashboard />,
		label: 'Dashboard'
	},
	{
		url: '/admin/collections',
		icon: <Shapes />,
		label: 'Collections'
	},
	// {
	// 	url: '/admin/tags',
	// 	icon: <Tag />,
	// 	label: 'Collections'
	// },
	{
		url: '/admin/manage-products',
		icon: <Store />,
		label: 'Products'
	},
	{
		url: '/admin/manage-orders',
		icon: <ShoppingBag />,
		label: 'Orders'
	},
	{
		url: '/admin/customers',
		icon: <UsersRound />,
		label: 'Customers'
	}
];
