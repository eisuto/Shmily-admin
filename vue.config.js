module.exports = {
  // 文件打包后 在index.html中引用的位置，与 process.env.BASE_URL相同
  publicPath:
    process.env.NODE_ENV === "production" ? "/vuetify-admin-template/" : "/",
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config.plugins.delete("prefetch");
  },
  productionSourceMap: false,
  css: {
    sourceMap: false
  },
  devServer: {
    port: 90,
    overlay: {
      warnings: false, //不显示警告
      errors: false	//不显示错误
    }
  },
  lintOnSave:false //关闭eslint检查
};
