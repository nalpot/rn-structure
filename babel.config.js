module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        ['transform-remove-console', {exclude: ['error']}],
        [
            'module-resolver',
            {
                root: ['.'],
                extensions: [
                    '.ios.ts',
                    '.android.ts',
                    '.ts',
                    '.ios.tsx',
                    '.android.tsx',
                    '.tsx',
                    '.jsx',
                    '.js',
                    '.json',
                ],
                alias: {
                    '@app/assets': './src/assets',
                    '@app/component': './src/component',
                    '@app/config': './src/config',
                    '@app/navigation': './src/navigation',
                    '@app/libs': './src/libs',
                    '@app/network': './src/network',
                    '@app/redux': './src/redux',
                    '@app/screens': './src/screens',
                },
            },
        ],
    ],
};
