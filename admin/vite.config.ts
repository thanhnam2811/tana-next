import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{ find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
			{ find: '@common', replacement: path.resolve(__dirname, 'src/common') },
			{ find: '@modules', replacement: path.resolve(__dirname, 'src/modules') },
			{ find: '@layout', replacement: path.resolve(__dirname, 'src/layout') },
		],
	},
});
