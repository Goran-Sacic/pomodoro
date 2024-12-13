import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	webpack(config) {
		config.module.rules.push({
			test: /\.mp3$/,
			use: {
				loader: 'file-loader',
				options: {
					publicPath: '/_next/static/audio/',
					outputPath: 'static/audio/',
					name: '[name].[hash].[ext]',
				},
			},
		});
		return config;
	},
};

export default nextConfig;
