import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable unused variable warnings
      "@typescript-eslint/no-unused-vars": "off",
      
      // Disable unescaped entities warnings (quotes and apostrophes)
      "react/no-unescaped-entities": "off",
      
      // Disable missing dependencies warnings in useEffect
      "react-hooks/exhaustive-deps": "off",
      
      // Disable img element warnings (allow regular img tags)
      "@next/next/no-img-element": "off",
      
      // Disable any type warnings completely
      "@typescript-eslint/no-explicit-any": "off",
      
      // Allow ts-ignore and ts-nocheck comments
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
];

export default eslintConfig;
