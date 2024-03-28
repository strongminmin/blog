---
title: scope hoisting 原理
sticky: 999
description: 深究 scope hoisting 原理
hiddenCover: false
comment: true
outline: [2,3]
tag:
 - Javascript
---
## Scope hoisting 所解决的问题
webpack具有万物皆模块的理念，每一个js文件都是一个JavaScript模块。  
  
一个bundle是由多个module合成的，一个bundle是一个js文件，所以webpack自己实现了一套commonjs规范用于让js成为一个独立的模块。  

来一个 🌰：  

比如说有 3 个模块，index.js、add.js、sum.js  
```
//add.js
export default (a, b) => a + b
```
```
// sum.js
export default arr => arr.reduce((pre, item) => pre + item, 0)
```
```
//index.js
import sum from './sum'
import add from './add'

let a = 1,
  b = 2,
  arr = [1, 2, 3, 4, 5]

console.log(add(a, b))
console.log(sum(arr))
```
打出来的代码如下(删除一些无用的代码)：
```
;(function(modules) {
  var installedModules = {}
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports
    }
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    })
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    )
    module.l = true
    return module.exports
  }

  return __webpack_require__((__webpack_require__.s = './src/index.js'))
})({
  /***/ './src/add.js': /***/ function(
    module,
    __webpack_exports__,
    __webpack_require__
  ) {
    'use strict'
    eval(
      '__webpack_require__.r(__webpack_exports__);\n// add.js\n/* harmony default export */ __webpack_exports__["default"] = ((a, b) => a + b);\n\n\n//# sourceURL=webpack:///./src/add.js?'
    )

    /***/
  },

  /***/ './src/index.js': /***/ function(
    module,
    __webpack_exports__,
    __webpack_require__
  ) {
    'use strict'
    eval(
      '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _sum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sum */ "./src/sum.js");\n/* harmony import */ var _add__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./add */ "./src/add.js");\n\n\n\nlet a = 1,\n  b = 2,\n  arr = [1, 2, 3, 4, 5]\n\nconsole.log(Object(_add__WEBPACK_IMPORTED_MODULE_1__["default"])(a, b))\nconsole.log(Object(_sum__WEBPACK_IMPORTED_MODULE_0__["default"])(arr))\n\n\n//# sourceURL=webpack:///./src/index.js?'
    )

    /***/
  },

  /***/ './src/sum.js': /***/ function(
    module,
    __webpack_exports__,
    __webpack_require__
  ) {
    'use strict'
    eval(
      '__webpack_require__.r(__webpack_exports__);\n// sum.js\n/* harmony default export */ __webpack_exports__["default"] = (arr => arr.reduce((pre, item) => pre + item, 0));\n\n\n//# sourceURL=webpack:///./src/sum.js?'
    )

    /***/
  }
})
```
可以看出由webpack打包出来的是一个大大的IIFE，上面一大堆是webpack自己实现的commonjs规范，下面的传参是我们的代码，可以看出webpack把我们的代码的每一个文件使用IIFE来做模块化，正式因为如此，问题出来了。  

**大量的函数闭包包裹代码，导致体积增大，模块越来越明显，运行代码时创建的函数作用域变多，导致内存开销变大。**  

解决上面问题的方法就是: ***scope hoisting***  

## 使用
使用 scope hoisting 有两种方式：  

- 使用 webpack 自带的 ModuleConcatenationPlugin 插件开启
```
module.exports = {
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()]
}
```
- webpack 构建项目生产环境默认开启(mode:production)
```
module.exports = {
  mode: 'production'
}
```
启动一下先来看打包结果  

```;(function(modules) {
  var installedModules = {}
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports
    }
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    })
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    )

    module.l = true
    return module.exports
  }

  return __webpack_require__((__webpack_require__.s = './src/index.js'))
})({
  /***/ './src/index.js': /***/ function(
    module,
    __webpack_exports__,
    __webpack_require__
  ) {
    'use strict'
    eval(
      '__webpack_require__.r(__webpack_exports__);\n\n// CONCATENATED MODULE: ./src/sum.js\n// sum.js\n/* harmony default export */ var sum = (arr => arr.reduce((pre, item) => pre + item, 0));\n\n// CONCATENATED MODULE: ./src/add.js\n// add.js\n/* harmony default export */ var add = ((a, b) => a + b);\n\n// CONCATENATED MODULE: ./src/index.js\n\n\n\nlet a = 1,\n  b = 2,\n  arr = [1, 2, 3, 4, 5]\n\nconsole.log(add(a, b))\nconsole.log(sum(arr))\n\n\n//# sourceURL=webpack:///./src/index.js_+_2_modules?'
    )

    /***/
  }
})

```

你会发现，使用scope hoisting 方式，IIFE 变成一个了(原来有 3 个)，add.js和sum.js 里面的代码被打包到了 index.js 中，减少了IIFE的数量。  

>原理： scope hoisting 将所有引入的模块按照顺序放在一个函数作用域里面，然后适当的重命名一些变量以防止变量名冲突。(总结一句：引用一次就内联进来，减少 IIFE 的数量)  


## 总结
以上就是IIFE的使用方式，对比一下没有scope hoisting的状态：减少了函数声明代码从而减少了函数作用域的生成，降低了内存开销。