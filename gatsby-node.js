const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      // @ts-ignore
      plugins: [new TsconfigPathsPlugin()],
    },
  })
}
