import {
	LayoutDashboard,
	Shapes,
	ShoppingBag,
	Store,
	UsersRound
} from 'lucide-react';

export const adminNavLinks = [
	{
		url: '/admin',
		icon: <LayoutDashboard />,
		label: 'Dashboard'
	},
	{
		url: '/admin/manage-categories',
		icon: <Shapes />,
		label: 'Categories'
	},
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
