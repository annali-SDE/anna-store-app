/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'm.media-amazon.com',
				pathname: '**'
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				pathname: '**'
			},
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
				pathname: '**'
			}
		]
	},
	experimental: {
		missingSuspenseWithCSRBailout: false
	}
};

module.exports = nextConfig;
