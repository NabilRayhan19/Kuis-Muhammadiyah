module.exports = {
    extends: ["next/core-web-vitals"],
    // Konfigurasi sederhana yang menghindari fungsi kustom
    parserOptions: {
        babelOptions: {
            presets: [require.resolve("next/babel")],
        },
    },
};