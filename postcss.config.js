const purgecss = [
  "@fullhuman/postcss-purgecss",
  {
    content: [
      "./src/pages/*.{js,ts,jsx,tsx}",
      "./src/components/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    whitelistPatterns: [/^slick-/],
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
  },
];
module.exports = {
  plugins: [
    "postcss-import",
    "tailwindcss",
    "autoprefixer",
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  ],
};
