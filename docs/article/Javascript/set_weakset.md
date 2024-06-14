---
title: Set与WeakSet
sticky: 999
description: Set与WeakSet
type: string
date: 2023-05-25
hiddenCover: false
comment: true
comment: true
outline: [2,3]
tag:
 - javascript
---

# Set与WeakSet

## Set
### 基本用法

ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。Set本身是一个构造函数，用来生成Set数据结构。

```js

const s = new Set();
[2,3,5,4,2,3].forEach((x) => s.add(x));
for(let key of s ){
      console.log(key);      // 2 3 5 4
}
//上面代码通过add方法向Set结构加入成员，结果表明Set结构不会添加重复的值
```
Set函数可以接受一个数组（或者是具有iterator接口的其他数据结构或者类似数组的对象）作为参数，用来初始化一个Set结构。

```js
const set = new Set([1,2,3,4,5,4,3,2,2]);
console.log([...set]);  //[1,2,3,4,5]       //数组去重
const items = new Set([1,2,3,4,5,5,5,5]);
console.log(items.size);    //5
const divSet = new Set(document.querySelectorAll("div"));
console.log(divSet.size);       //0
```
Set运用于数组去重。

```js
console.log([... new Set([1,2,3,4,5,6,5,4,3,3,2,1])]);      //[1,2,3,4,5,6]
```
 向Set加入值的时候，不会发生类型转换，所以5和“5”是两个不同的值。Set内部判断两个值是否不同，使用的算法叫做 Same-value-zero equality,它类似于精确相等运算符（===），主要区别是NaN等于自身，而精确相等运算符认为NaN不等于自身。

```js
let set = new Set();
let a = NaN;+
let b = NaN;
set.add(a);
set.add(b);
let c = -0;
let d = +0;
set.add(c);
set.add(d);
console.log(set);   //{NaN,0}  只有一个NaN，所以表明，在Set内部，NaN是相等的   -0和+0是相等的
```

在Set中两个对象总是不相等的,原因是对象是引用值，存储地址不同.

```js
let set = new Set();
set.add({});
console.log(set.size);  //1
set.add({});
console.log(set.size);  //2
```
### Set实例的属性和方法
Set结构的实例有以下属性

- Set.prototype.constructor：构造函数，默认就是Set函数。
- Set.prototype.size：返回Set实例的成员总数。

Set实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）
- add(value)：添加某个值，返回Set结构本身。
- delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- has(value)：返回一个布尔值，便是该值是否为Set成员。
- clear()：清除所有成员，没有返回值。

```js
let s = new Set();
s.add(1).add(2).add(2);
console.log(s); //[1,2]
console.log(s.size);       //2
console.log(s.has(1));  //true
console.log(s.has(2));  //true
console.log(s.has(3));  //false
console.log(s.delete(2));   //true
console.log(s.delete(2));   //true
console.log(s.has(2));  //false
console.log(s.clear()); 
console.log(s)      //{}
```

Array.form方法可以将Set结构转为数组。

```js
const set = new Set([1,2,3,4,5]);
console.log(Array.from(set));       //[1,2,3,4,5]
```
数组去重方法。
```js
const dedupe = (array) => Array.from(new Set(array));
console.log(dedupe([1,2,3,4,5,4,2,3,1,6])); //[1,2,3,4,5,6]
```

### 遍历方法及应用

Set结构的实例有四个遍历方法，可以用于遍历成员。
- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回键值对的遍历器
- forEach()：使用回调函数遍历每个成员

> 注意：Set的遍历顺序就是插入顺序，比如使用Set保存一个回调函数列表，调用时就能保证按照添加顺序调用。

#### keys(),values(),entries()

 keys方法，values方法，entries方法返回的都是遍历器对象。由于Set结构没有键名，所以keys方法可values方法的行为完全一致。

```js
let s = new Set(['red','green','blue']);
for(let item of s.keys()) {
    console.log(item);  //red green blue
}
for(let item of s.values()) {
    console.log(item);      //red green blue
}
for(let [k,v] of s.entries()) {
    console.log(k,v);      //red red green green blue blue
}
//上面代码中，entries方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相同。
```

Set结构的实力默认可遍历，它的默认遍历器生成函数就是它的values方法。
```js

console.log(Set.prototype[Symbol.iterator] === Set.prototype.values);   //true
```

这意味着，可以省略 value方法，直接用for...of循环遍历set

```js
let set = new Set(['red','green','blue']);
for(let item of set){
    console.log(item);  //red green blue
}
```

#### forEach()
Set结构的实例与数组一样，也拥有forEach方法，用于对每个成员执行某种操作，没有返回值。

```js
let set = new Set([1,2,3,4,5]);
set.forEach((x) => console.log(x))
//上面代码说明，forEach方法的参数就是一个处理函数，该函数的参数与数组的forEach一致，依次为键值，键名，集合本身
 注意:SEt结构的键名和键值是一样的，因此第一个参数与第二个参数永远是一样的。
```

#### 遍历的应用
扩展运算符内部使用的是for of循环，所以也可以用于Set结构。
```js
let set = new Set(['red','green','blue']);
console.log([...set]);
```

扩展运算符和Set结构相结合，实现数组去重。
```js
console.log([...(new Set([1,2,3,4,5,4,2,4,5]))]);   //[1,2,3,4,5]
```

数组的map和filter方法也可以间接的用在Set上。

```js
let arr = [1,2,3,4,5];
const set = new Set(arr.map(x => x + 1));
console.log(set);       //{2,3,4,5,6}
let set = new Set([1,2,3,4,5]);
set = new Set([...set].filter(x => x % 2 === 0));
console.log(set);   //{2,4}
```

使用Set可以很容易的实现并集、交集、差集。
```js
let a = new Set([1,2,3]);
let b = new Set([4,3,2]);
//并集
const union = new Set([...a,...b]);
console.log(union); //{1,2,3,4}
//交集
const intersect = new Set([...a].filter(x => b.has(x)));
console.log(intersect); //{2,3}
//差集
const difference = new Set([...a].filter(x => !b.has(x)));
console.log(difference);    //{1}

```

如果想在遍历操作中，改变原来的Set结构，目前没有直接的方法，但是有两种变通方法。一种是利用原Set结构映射出一个新的结构，然后赋值给原来的Set结构，另一种是通过Array.from方法。

```js
//方法一
let set = new Set([1,2,3,4]);
set = new Set([...set].map(x => x * 2));
console.log(set);       //{2,4,6,8}
//方法二
let set = new Set([1,2,3,4]);
set = new Set(Array.from(set,x => x * 2));
console.log(set);   //{2,4,6,8}
```

## WeakSet
### 含义

WeakSet结构与Set类似，也是不重复的集合。但是，它与Set有两个区别
1. WeakSet的成员只能是对象，而不能是其他的值。
2. WeakSet中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用，也就是说，如果其他对象都不再引用该对象。那么垃圾回收机制会自动会输该对象所占用的额内存，不考虑该对象还存在与WeakSet之中。

```js
let ws = new WeakSet();
ws.add(123);        //报错
 ws.add(Symbol("foo"));  //报错
```
### 语法

WeakSet是一个构造函数，可以使用new命令，创建WeakSet数据结构。WeakSet可以接受一个数组或类似数组的对象作为参数（实际上，任何具有Iterator接口的对象，都可以作为WeakSet的参数。）该数组的成员都自动会成为WeakSet实例对象的成员。

```js
const a = [[1,2],[3,4]];
const ws = new WeakSet(a);
console.log(ws); 
```

> 注意：参数数组的成员为WeakSet实例对象的成员，如果参数数组的成员不是对象的话，将会报错。

```js
const arr = [1,2,3];
const ws = new WeakSet(arr);    //报错
console.log(ws); 

```
### WeakSet结构的三个方法
- WeakSet.prototype.add(value)：向WeakSet实例添加一个新成员。
- WeakSet.prototype.delete(value)：清楚WeakSet实例的指定成员，
- WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在WeakSet实例之中。
```js
const ws = new WeakSet();
const obj = {};
const foo = {};
ws.add(window);
ws.add(obj);
console.log(ws.has(window));    //true
console.log(ws.has(foo));       //false
ws.delete(window);
console.log(ws.has(window));    //false
```
WeakSet没有size属性，没有办法遍历它的成员。

```js
const ws = new WeakSet([[1,2],[3,4]]);
console.log(ws.size);   //undefined
console.log(ws.forEach);    //undefined
console.log(ws.forEach((item) => item));        //报错
```

WeakSet不能遍历，是因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到了，WeakSet的一个用处，是储存Dom节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

```js
const foos = new WeakSet();
class Foo {
     constructor() {
        foos.add(this);
     }
    method () {
        if(! foos.has(this)) {
            throw new TypeError("Foo.prototype.method 只能在Foo的实例上调用！");
        }
    }
}
const foo = new Foo();
console.log(foo.method());
//上面代码保证了Foo的实例方法，只能在Foo的实例上调用。这里使用 WeakSet 的好处是，
//foos对实例的引用，不会被计入内存回收机制，所以删除实例的时候，不用考虑foos，也不会出现内存泄漏。
```


​
