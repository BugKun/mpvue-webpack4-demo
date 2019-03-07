# mpvue-webpack4-demo

> A Mpvue project in webpack4

## Branch
当前分支的是 Webpack4 + Babel@7

[点击我切换到 Webpack4 + Babel@6 的分支](https://github.com/BugKun/mpvue-webpack4-demo/tree/master)

## Build Setup

``` bash

# 安装依赖
npm install

# 开发时构建
npm run dev

# 打包构建
npm run build

# 指定平台的开发时构建(微信、百度、头条、支付宝)
npm run dev:wx
npm run dev:swan
npm run dev:tt
npm run dev:my

# 指定平台的打包构建
npm run build:wx
npm run build:swan
npm run build:tt
npm run build:my

# 生成 bundle 分析报告
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Description
### 此 DEMO 与官方对比修改了的内容
* `webpack` 的配置项更新为 `webpack4` 的配置项并配置和使用了`babel@7`。(https://github.com/BugKun/mpvue-webpack4-demo/tree/feature/babel%407)
* 对 `webpack-mpvue-asset-plugin` 进行了修改，并重命名为 [webpack4-mpvue-asset-plugin](https://www.npmjs.com/package/webpack4-mpvue-asset-plugin) 方便在 `npm` 上安装。[查看源码](https://github.com/BugKun/webpack-mpvue-asset-plugin/tree/feature/webpack4)
* 对 `mpvue-loader` 进行了修改，并重命名为 [webpack4-mpvue-loader](https://www.npmjs.com/package/webpack4-mpvue-loader) 方便在 npm 上安装。
[查看源码（babel@6）](https://github.com/BugKun/mpvue-loader/tree/feature/webpack4-support)
[查看源码（babel@7）](https://github.com/BugKun/mpvue-loader/tree/feature/webpack4_babel%407-support)
* 新增 [webpack4-mpvue-optimize-plugin](https://www.npmjs.com/package/webpack4-mpvue-optimize-plugin) ，用于处理 `webpack4` 打包时抽取公共代码后全局变量不是 `global` 的问题。
* 替换了 `mpvue-webpack-target` 为 [mpvue-webpack-target-webpack4](https://www.npmjs.com/package/mpvue-webpack-target-webpack4), 这个包是由 [Beven91](https://github.com/Beven91) 进行修改和开源的，改得非常好，我就不另外自己写了，就直接使用这个包了。[查看源码](https://github.com/Beven91/mpvue-webpack-target)