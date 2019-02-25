module.exports = {
    env: {
        es6: true,
        node: true,
        mocha: true
    },
    plugins: ["security"],
    extends: ["plugin:security/recommended"],
    parserOptions: {
        sourceType: "module"
    }
};
