import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";
  
  /** @type {import('tailwindcss').Config} */
  export const content = [
	// your paths
	// "./src/**/*.{ts,tsx}",
	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
	  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./components/**/*.{js,ts,jsx,tsx,mdx}",
];
export const darkMode = "class";
export const theme = {
	extend: {
		animation: {
			aurora: "aurora 60s linear infinite",
		},
		keyframes: {
			aurora: {
				from: {
					backgroundPosition: "50% 50%, 50% 50%",
				},
				to: {
					backgroundPosition: "350% 50%, 350% 50%",
				},
			},
		},
	},
};
export const plugins = [addVariablesForColors];
  
  // This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
  function addVariablesForColors({
	addBase,
	theme
  }) {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));
  
	addBase({
	  ":root": newVars,
	});
  }
  




// /** @type {import('tailwindcss').Config} */
// export default {
// 	content: [
// 	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
// 	  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
// 	  "./components/**/*.{js,ts,jsx,tsx,mdx}",
   
// 	  // Or if using `src` directory:
// 	  "./src/**/*.{js,ts,jsx,tsx,mdx}",
// 	],
// 	darkMode: ["class"],
// 	theme: {
//     	extend: {
//     		borderRadius: {
//     			lg: 'var(--radius)',
//     			md: 'calc(var(--radius) - 2px)',
//     			sm: 'calc(var(--radius) - 4px)'
//     		},
//     		colors: {}
//     	}
//     },
// 	plugins: [require("tailwindcss-animate")],
//   }