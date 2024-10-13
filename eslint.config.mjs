import js from "@eslint/js"
import ts from "typescript-eslint"

export default [
    { ignores: ["**/node_modules", "**/dist", "eslint.config.mjs"] },
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    js.configs.recommended,
    ...ts.configs.strict,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    {
        rules: {
            "no-console": "error",
            curly: ["error"],
            "default-case": ["error"],
            "default-case-last": ["error"],
            eqeqeq: ["error"],
            "no-var": ["error"],
            "require-await": ["error"],

            // typescript rules
            "@typescript-eslint/no-explicit-any": ["error"],
            "@typescript-eslint/switch-exhaustiveness-check": ["error"],
            "@typescript-eslint/no-unused-vars": ["warn"]
        }
    }
]
