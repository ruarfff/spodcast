module.exports = {
    purge: ["./app/**/*.tsx", "./app/**/*.js", "./app/**/*.mdx"],
    darkMode: "class",
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
    theme: {
        extend: {},
    },
    variants: {},
  };
