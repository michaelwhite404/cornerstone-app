module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix for ESM packages (like react-chartjs-2) that use non-fully-specified imports
      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      });
      return webpackConfig;
    },
  },
};
