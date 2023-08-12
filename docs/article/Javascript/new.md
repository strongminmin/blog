---
title: new运算符的模拟实现
sticky: 999
description: 手写实现new运算符
hiddenCover: false
comment: true
outline: [2,3]
tag:
 - Javascript
---
一句话介绍JavaScript中的new运算符:
> <font color=blue> new运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一。</font>

我们都知道在JavaScript中new运算符是利用构造函数的方式创建对象的，今天就来模拟一个这个new运算符的功能。
对new关运算符通过构造函数创建对象得到的对象 进行分析：
>1. 所得到对象的属性中有构造函数中this所绑定的属性
>2. 所得到的对象可以访问构造函数原型链上的属性和方法。

基于上面两点来聊一下模拟new有哪些注意点：
**1.使用new利用构造函数创建对象的返回值**
- 当函数没有返回值的时候，默认返回为this
- 当函数返回一个对象的时候，返回值为此对象
- 当返回值为null、undefined等原始值 的时候 返回this
- 当返回值为对象、数组、function的时候返回此类型

**2.this属性的赋值**
- 函数中this的属性的写操作都会被赋予到返回的对象上面

**3.函数原型链的继承**
- 返回的对象会继承函数的原型链

根据以上分析自己模拟一下new，由于new是一个关键字，所以使用函数的形式来模拟一下。
```javascript
function objectFactory() {
            var Constructor = [].shift.call(arguments);
            var obj = Object.create(Constructor.prototype);
            var result = Constructor.apply(obj, arguments);
            return Object.prototype.toString.call(result).match(/^\[object (\w+)\]$/)[1] === "Object" || "Function"  ? result : obj;
        }
```

代码详解：

1. 通过[].shift.call(arguments)的方式把arguments的第一位参数(也就是构造函数)截下来，这里注意数组的shift方法改变原数组；
2. 通过Object.create创建对象的方式创建对象，并继承Constructor.prototype
3. 通过apply改变函数中this指向的方法将构造函数中的this属性赋值赋予对象，
4. 通过正则加类型判断判定返回值。


