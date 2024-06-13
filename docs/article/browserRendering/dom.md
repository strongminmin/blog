---
title: 如何生成一个DOM树
sticky: 999
description: dom树的生成过程
hiddenCover: false
type: string
date: 2023-11-10
comment: true
outline: [2,3]
tag:
 - browserRendering, dom
---
# 如何生成一个DOM树
浏览器渲染过程中，我们都知道首先会将HTML转换为DOM，这个转换过程很容易被忽略，面试过程也有被问到，因此就来总结一下。  

## 什么是DOM
从网络传递给渲染引擎的HTML文件字节流无法直接被渲染引擎直接理解，而 <font color="red" italic=true >*DOM*</font> 能够将HTML文件字节流处理成渲染引擎能够理解的内部结构。
DOM的作用一般有：  
1. 从页面视角上，DOM 是生成页面的基础数据结构
2. 从JavaScript脚本上，DOM为JavaScript脚本提供了接口，从而使JavaScript能够操作DOM结构。
3. 从安全方面， DOM 解析阶段能将一些不安全的内容过滤掉。

>总之，DOM 是表述 HTML 的内部数据结构，它会将 Web 页面和 JavaScript 脚本连接起来，并过滤一些不安全的内容。  

## 怎么生成DOM
首先，要将 HTML 转换成 DOM 需要使用渲染引擎中的 HTML解析器。  

**HTML解析器的执行时机是**：网络进程加载了多少数据，HTML解析器解析多少数据。  

**数据流向问题**：
当 <font color="green">网络进程</font> 收到响应头之后，会根据content-type来判断文件的类型，比如content-type的值为"text/html" 表示这是一个HTML文件，然后为该请求 选择或创建 一个 <font color="green">渲染进程</font> 。  

网络进程 和 渲染进程之间会建立一个共享数据管道，数据从网络进程 经过 管道 传递给 渲染进程，渲染进程使用HTML解析器动态接收HTML字节流，并将其转换为DOM

### HTML解析器工作流程
HTML解析器的工作流程（共三个阶段）：
- 通过分词器将字节流转换为 Token
- 后续的第二个和第三个阶段是同步进行的，需要将 Token 解析为 DOM 节点，并将 DOM 节点添加到 DOM 树中。

![HTML解析器工作流程](./images/image.png "html")
<center style="font-size:14px;color:#C0C0C0;">HTML解析器工作流程</center>

#### 1. 通过分词器先将字节流转换为一个个Token
如上图所示，首先需要通过分词器先将字节流转换为一个个Token，分为 Tag Token 和文本 Token。  
> Tag Token 又分 StartTag 和 EndTag
如下列代码
```html
<html>
    <body>
        <div>test1</div>
        <div>test2</div>
    </body>
</html>
```
![Token](./images/token.png 'token')
<center style="font-size:14px;color:#C0C0C0;">Token生成过程</center>

#### 2 & 3 将Token生成DOM节点，并将DOM节点添加到DOM树中
HTML解析器使用Token栈结构，来计算父子节点之间的关系。将第一阶段中生成Token压入到栈中
具体规则为：
1. 如果压入栈内的是 **StartTag** ，HTML解析器会为该Token创建一个DOM节点，并将该节点加入到DOM树。（它的父节点就是栈中相邻的节点）  
2. 如果遇到 **文本Tag** ，那么会生成一个文本节点，则该Token不入栈，直接将其加入到DOM树中（它的父节点就是当前栈顶 Token 所对应的 DOM 节点。）  
3. 如果遇到 **EndTag 标签**， 比如是 EndTag div，HTML 解析器会查看 Token 栈顶的元素是否是 StarTag div，如果是，就将 StartTag div 从栈中弹出，表示该 div 元素解析完成。  


通过分词器产生的新 Token 就这样不停地压栈和出栈，整个解析过程就这样一直持续下去，直到分词器将所有字节流分词完成  

><font color="red">注意</font>：HTML 解析器开始工作时，会默认创建了一个根为 document 的空 DOM 结构，同时会将一个 StartTag document 的 Token 压入栈底。然后经过分词器解析出来的第一个 StartTag html Token 会被压入到栈中，并创建一个 html 的 DOM 节点，添加到 document 上

## JavaScript 和 CSS 是如何影响DOM的生成的？
### JS 影响 DOM 生成
#### 页面中直接内嵌 JavaScript 脚本
首先分析一下在页面中直接插入JS脚本，
```HTML
<html>
<body>
    <div>test1</div>
    <script>
    let div1 = document.getElementsByTagName('div')[0]
    div1.innerText = 'blog.ximina.cn'
    </script>
    <div>test2</div>
</body>
</html>
```  

script标签之前，所有的解析流程还是和之前一样，但是解析到script标签时，渲染引擎判断这是一段脚本，此时 HTML 解析器就会暂停 DOM 的解析，因为接下来的 JavaScript 可能要修改当前已经生成的 DOM 结构。  

这时候 HTML 解析器暂停工作，JavaScript 引擎介入，并执行 script 标签中的这段脚本，因为这段 JavaScript 脚本修改了 DOM 中第一个 div 中的内容，所以执行这段脚本之后，div 节点内容已经修改为 blog.ximina.cn 了。脚本执行完成之后，HTML 解析器恢复解析过程，继续解析后续的内容，直至生成最终的 DOM。  


#### 在页面中引入 JavaScript 文件
接下来，分析一下引入外部js文件的情况，如下段代码
```js
//index1.js
let div1 = document.getElementsByTagName('div')[0]
div1.innerText = 'blog.ximina.cn'
```
```html
<html>
    <body>
        <div>test1</div>
        <script type="text/javascript" src='index1.js'></script>
        <div>test2</div>
    </body>
</html>
```
其整个执行流程还是跟直接内嵌js脚本一样的，执行到 JavaScript 标签时，暂停整个 DOM 的解析，执行 JavaScript 代码，不过这里执行 JavaScript 时，**需要先下载这段 JavaScript 代码**。这里需要重点关注下载环境，因为 JavaScript 文件的下载过程会阻塞 DOM 解析，而通常下载又是非常耗时的，会受到网络环境、JavaScript 文件大小等因素的影响。
>不过 Chrome 浏览器做了很多优化，其中一个主要的优化是**预解析操作**。当渲染引擎收到字节流之后，会开启一个预解析线程，用来分析 HTML 文件中包含的 JavaScript、CSS 等相关文件，解析到相关文件之后，预解析线程会提前下载这些文件。  


#### JS 线程会阻塞 DOM 问题解决
<font color="red">引入 JavaScript 线程会阻塞 DOM</font>
那么如何解决呢？  
当然有一定的策略啦。比如使用 
- CDN 来 **加速** JavaScript 文件的加载，  **压缩** JavaScript 文件的体积。  
- 另外，如果 JavaScript 文件中没有操作 DOM 相关代码，就可以将该 JavaScript 脚本设置为异步加载，通过 **async 或 defer** 来标记代码，使用方式如下所示：

```JS
 <script async type="text/javascript" src='foo.js'></script>
 <script defer type="text/javascript" src='foo.js'></script>
```
>async 和 defer 虽然都是异步的，不过还有一些差异，使用 async 标志的脚本文件一旦加载完成，会立即执行；而使用了 defer 标记的脚本文件，需要在 DOMContentLoaded 事件之前执行。

### CSS 影响 DOM 生成
直接上代码示例
```CSS
/* index.css */
div {color:blue}
```
```HTML
<html>
    <head>
        <style src='theme.css'></style>
    </head>
<body>
    <div>1</div>
    <script>
            let div1 = document.getElementsByTagName('div')[0]
            div1.innerText = 'blog.ximina.cn' //需要DOM
            div1.style.color = 'red'  //需要CSSOM
        </script>
    <div>test</div>
</body>
</html>
```
如上述代码，JavaScript 代码出现了 div1.style.color = ‘red' 的语句，它是用来操纵 CSSOM 的，所以在执行 JavaScript 之前，需要先解析 JavaScript 语句之上所有的 CSS 样式。所以如果代码里引用了外部的 CSS 文件，那么在执行 JavaScript 之前，还需要等待外部的 CSS 文件下载完成，并解析生成 CSSOM 对象之后，才能执行 JavaScript 脚本。

而 JavaScript 引擎在解析 JavaScript 之前，是不知道 JavaScript 是否操纵了 CSSOM 的，所以渲染引擎在遇到 JavaScript 脚本时，不管该脚本是否操纵了 CSSOM，都会执行 CSS 文件下载，解析操作，再执行 JavaScript 脚本。

所以说 JavaScript 脚本是依赖样式表的，这又多了一个阻塞过程。


因此 JavaScript 会阻塞 DOM 生成，而样式文件又会阻塞 JavaScript 的执行，所以在实际的工程中需要重点关注 JavaScript 文件和样式表文件，使用不当会影响到页面性能的。

