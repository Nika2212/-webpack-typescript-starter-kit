const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HTMLWebpackConfig = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;
const filename = (extension) => {
  return isProduction ? `bundle.[hash].${extension}` : `bundle.${extension}`;
};
const getJSLoaders = () => {
  const loaders = [
    {
      loader: "ts-loader"
    }
  ];

  if (isDevelopment) {
    loaders.push({loader: "tslint-loader"});
  }

  return loaders;
};

const config = {
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, "src"),
  entry: ["./entry.ts"],
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    port: 4200,
    hot: true
  },
  devtool: isDevelopment ? false : false,
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: getJSLoaders()
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCSSExtractPlugin.loader,
            options: {
              hmr: isDevelopment,
              reloadAll: true,
              publicPath: path.resolve(__dirname, "dist")
            }
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")]
            }
          },
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackConfig({
      template: "index.html",
      minify: isProduction
    }),
    new MiniCSSExtractPlugin({
      filename: filename("css")
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src/favicon.ico"),
        to: path.resolve(__dirname, "dist")
      },
      {
        from: path.resolve(__dirname, "src/assets/image"),
        to: path.resolve(__dirname, "dist/assets/image")
      },
      {
        from: path.resolve(__dirname, "src/assets/font"),
        to: path.resolve(__dirname, "dist/assets/font")
      }
    ])
  ]
};

module.exports = config;
