---
title: 探索JavaScript的this机制
sticky: 999
description: 探索JavaScript的this机制
hiddenCover: false
comment: true
outline: [2,3]
tag:
 - javascript
---

# 探索JavaScript的this机制

## 前言
白的不能再白的小白，通过各种渠道学习到了this，和大家分享，有什么错误的话还望指出，共同学习进步。觉得好的话还望点个小赞，为继续坚持写文章增加动力。
## 正文
我在想写这篇文章的时候，我是无从下手的。因为我自己也同样说不清在JavaScript中this到底是什么？我们都知道在一些强类型语言中（像java）对this有一个很好的定义：**this就是一个指针，指向当前对象**。在JavaScript中如果用上面这种方法来表示this的话，是不完全的。对于我来说，this就像JavaScript中的魔术师，千变万化中又有着那么一丝丝小套路。
## 何为this？
this是JavaScript语法中很难捉摸透的一个东西。我们都知道JavaScript执行机制分为四个步骤：`词法分析`、`语法分析`、`预编译`、`解释执行(运行时)`。我们在执行代码的时候，通常是在全局中执行一个函数或者通过对象方法调用执行函数，在函数调用过程中得到this。也就是说this这个东西就生在运行时，即**this是在运行时绑定的，而非编译时**。


## JavaScript中函数调用的几种方式
### 默认调用
在JavaScript中调用函数的最常见的一种方法就是默认调用。
```JavaScript
function test(){
    console.log(this);
}
test()
```
正如上面代码这样调用test函数，就是默认调用。

默认调用的情况下，函数的this指向全局对象。

我们都知道在ES5出现了`严格模式`这个概念。在严格模式下全局对象的`this`指向`undefined`，非严格模式下全局对象的`this`指向`Window`对象。
```javascript
//严格模式
"use strict";
function test(){
    console.log(this);  //undefined
}
test()
```
```javascript
//非严格模式下
function test(){
    console.log(this);  //window
}
test();
```
### IIFE
立即执行函数在执行的时候会形成一个闭包，其中的`this`永远指向`window`。
```javascript
(function(){
    console.log(this);  //window
}())
```
### 隐式绑定
隐式绑定也可以说成作为对象的方法来调用。看下面代码
```javascript
function test(){
    console.log(this.a);
}
var obj = {
    a : 2,
    test:test,
}
obj.test(); //2
```
这里可以看出obj中有一个属性为test，它的属性名为test函数。当test这个属性被创建的时候，会在内存中开辟一小段空间，而内存中所存的值就是test函数所在内存的地址。此时就把test函数隐式的绑定到了obj上面，当使用obj调用test的时候，test中的this就指向了调用test的对象。

这里就可以总结出一个套路：**谁调用函数，函数的this就指向谁**。

另外一种情况：
```javascript
function foo(){
    console.log(this.a);
}
var obj2 = {
    a:1,
    foo :foo,
}
var obj1 = {
    a : 2,
    obj2 : obj2
}
obj1.obj2.foo() //1
```
当对象方法调用链很长的时候，只有方法引用链的上一层或者说是最后一层在调用位置中起作用。上面代码中只有obj2会起作用。

隐式绑定中还有一个现象是**隐式丢失**，也就是说当把一个对象的方法暴露在外部的时候(也就是说把对象的方法赋于一个全局的变量)，再通过默认调用的方式调用这个函数，此时的this就不会再指向对象，而是指向window。
```javascript
var obj  ={
    foo : function(){
        console.log(this);
    }
}
obj.foo()  //obj
var fun = obj.foo; //把对象的方法暴露在外部
fun();  //window
```
### 显示绑定
显示绑定也可以称之为硬绑定。所谓硬绑定就是使用一种手段强制的改变函数的this执行，这种强制的手段通过call、apply、bind等函数的API来实现。这里由于说的是this机制，就先不提call、apply、bind等原理。
#### Function.prototype.call
call的作用就是改变函数调用中的this指向，call方法第一个参数就是绑定的this到哪个对象上，后面的参数是传递函数的实参。
```javascript
function test(name,age){
    console.log(name);
    console.log(age);
    console.log(this);
}
var obj ={}
test.call(obj,'xiaoming',18);    // xiaohong 18 obj
```
#### Function.prototype.apply
apply的作用和call的作用相同，同样是为了改变this指向，唯一不同的区别是call在传递函数实参的时候是通过分来传参，apply函数传参是通过传递一个数组。
```javascript
function test(name,age){
    console.log(name);
    console.log(age);
    console.log(this);
}
var obj ={}
test.call(obj,['xiaoming',18]);    // xiaohong 18 obj
```
#### Function.prototype.bind
bind是ES5出现的一个API，同样也是可以改变this指向。bind和上面两个API有很大的不同之处，call和apply是立即执行所调用的函数。bind是返回一个新函数，并且支持柯里化(分布传参)。
```javascript
function test(name,age){
    console.log(name);
    console.log(age);
    console.log(this);
}
var obj ={}
var fun = test.bind(obj,'xiaoming');    //调用bind方法，第一个参数传入所要绑定的对象，第二个参数传入name,并且返回一个新函数。
fun(18);        //传递剩余的参数。
                //输出 xiaohong 18 obj
```
### 构造函数调用
JavaScript中的面向对象编程是很模糊的，起初这个语言并不是为面向对象编程而设计的，JavaScript语言的特性更类似于函数式编程。我们为了使用JavaScript模拟面向对象编程，从而有了构造函数的概念：**使用new调用的函数称为构造调用，而这个函数被称为构造函数。**

发生构造函数调用会自动执行以下操作:

1. 创建一个全新的对象。
2. 这个新对象会被执行[[Prototype]连接
3. 这个新对象会绑定到函数调用的this
4. 如果函数没有返回其他对象(对象、数组、函数)，那么new表达式中的函数调用会自动返回这个新对象。

```javascript
function Test(name,age){
    this.name = name;
    this.age = age;
}
var test = new Test('xiaoming',18);
console.log(test)   //Test{}    
```

## 函数调用的优先级
那么多函数调用方式，如果同时出现的话究竟哪个优先级高，哪个优先级低呢？
### 默认调用和隐式绑定
先来看一下最基础的两种
```javascript
function test(){
    console.log(this);
}
//默认调用
test(); //window
var obj = {
    test : test,
}
//隐式绑定
obj.test(); //obj
```
可以明显的看出，同一个函数默认调用的情况下this为window，隐式绑定的情况下this指向obj,很明显隐式绑定改变了默认调用的this，所以**隐式绑定的优先级比默认调用的优先级高**。
### 隐式绑定和显示绑定
再来看一下隐式绑定
```javascript
var temp = {
    a : 1,
}
var obj = {
    a : 2
    foo : function(){
        console.log(this.a);
    }
}
//隐式绑定
obj.foo()   //2
//显示绑定
obj.foo.call(temp); //1
```
我们可以发现显示绑定改变了隐式绑定的this，即**显示绑定的优先级大于隐式绑定**
### 显示绑定和构造调用
如果让显示绑定和构造调用相比的话，就需要bind了，因为call和apply都是直接调用，没办法和构造调用相比，而bing则是返回一个新函数，可以使用构造调用。
```javascript
var obj = {
    a : 1,
}
function Test(){
    console.log(this.a);
}
//显示绑定
var fun = Test.bind(obj); //此时函数已经绑定了obj对象。
fun();      //执行fun，输出1
//构造调用
new fun(); //unfeinde
```
我们发现，fun此时已经绑定了obj，输出1，对的没有关系，使用new fun怎么就输出undefined了呢，其实这里输出的是fun构造函数返回的对象。新创建的对象上没有a属性，我们来修改一行代码再测试下。
```javascript
function Test(){
    console.log(this)
}
```
重新调用
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ea10673fa754f6db009ae3f2eac6e62~tplv-k3u1fbpfcp-zoom-1.image)
得出结论**构造函数调用比显示绑定的优先级高**，这里涉及到bind原理的东西，目前没有写这类文章，喜欢探索的可以自行google下。

所以最后得出的结论是：**构造函数调用>显示绑定>隐式绑定>默认调用**。

### 判断this规则
1. 判断是否是立即执行函数，如果是则this为window，如果不是移步第2步骤。
2. 判断this是否是通过构造函数调用,如果是this就绑定新创建的对象,如果不是移步第3步骤。
3. 判断是否是通过call、apply、bind等绑定，如果是this绑定指定对象，如果不是移步第4步骤。
4. 判断函数是够是在某个上下文对象中调用，如果是this就绑定在上下文对象上，如果不是请移步第5步骤。
5. 如果上面都不是的话，那么函数使用默认调用，如果是严格模式，则this为undefined，如果是非严格模式，则this为window。

## 箭头函数的this
起这个小标题说实话不太想起，因为箭头函数中是没有this的，怎么说呢,请移步[软大大的箭头函数](http://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0)。在其他函数中this是可变的，在箭头函数中this是固定的，同样也是因为箭头函数中没有this。在`你不知道的JavaScript(上)`中有那么一句话：**箭头函数在涉及this绑定的行为和普通的行为完全不一致。它放弃了所有普通this绑定的规则，取而代之的是用当前的词法作用域覆盖了this本来的值。**

这句话和上面其实是不矛盾的，所谓词法通俗的将就是书写代码的位置。箭头函数书写在什么地方，它的this就是所处环境的执行上下文对象的this。
```javascript
var a  = 2;
var obj = {
    a : 1,
    foo : ()=> {
        console.log(this.a);
    }
}
//此时obj定义在全局内，箭头函数中的this为window，故：输出2
obj.foo();  //2
```
```JavaScript
var a  = 2;
var obj = {
    a : 1,
    fun : function(){
        var foo = ()=>{
            console.log(this.a);
        }
        foo();
    }
}
//此时foo定义在fun函数中，执行fun函数，fun函数中的this为obj，所以箭头函数中的this为obj。故：输出1
obj.fun();  //1
```
## 总结
1. 如果是箭头函数，则就判断箭头函数定义在什么地方，this就是什么。
2. 如果是立即执行函数，则this就是windows
3. 其他形式则按照判断this的规则来。

文章总结自：[你不知道的JavaScript(上)](https://book.douban.com/subject/26351021/)，安利一波，值得一读。
