module.exports = {
  entry: "./es5/index.js",
  output: {
    path: __dirname + "/web/",
    filename: "loopcall.js",
    library: "loopcall",
    libraryTarget: "umd"
  },
  devtool: "source-map"
}
