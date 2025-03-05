/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";
module.exports = {
	content: [
		"./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./src/**/*.{js,jsx,ts,tsx}",
		"./src/pages/**/*.{js,jsx,ts,tsx}",
		"./src/components/**/*.{js,jsx,ts,tsx}",
		"./src/layouts/**/*.{js,jsx,ts,tsx}",
		"./src/utils/**/*.{js,jsx,ts,tsx}",
		"./src/hooks/**/*.{js,jsx,ts,tsx}",
		"./src/lib/**/*.{js,jsx,ts,tsx}",
		flowbite.content(),
	],
	theme: {
		extend: {},
	},
	plugins: [flowbite.plugin()],
};
