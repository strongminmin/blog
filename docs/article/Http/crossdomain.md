---
title: 跨域常见的解决办法
sticky: 999
description: 同源策略、跨域
type: string
date: 2024-01-02 20:00:00
hiddenCover: false
comment: true
outline: [2,3]
tag:
 - http
---
# 跨域常见的解决办法
## 什么是同源策略
同源策略是浏览器的一个重要的安全策略，其中，  
><font color="red" size="4">源 = 协议 + 域名 + 端口</font>  

两个源相同，称为同源，两个源不同，称之为跨源或者跨域。  
比如：
源 1 |	源 2 |是否同源
-|:-:|:-:
`http://www.baidu.com` | `http://www.baidu.com/news` | ✅
`https://www.baidu.com` | `http://www.baidu.com` | ❌
`http://localhost:5000` | `http://localhost:7000` | ❌
`http://localhost:5000` | `http://127.0.0.1:5000` | ❌
`http://www.baidu.com` | `http://baidu.com`	| ❌
		
同源策略是指，若页面的源和页面运行过程中加载的源不一致时，处于安全考虑，浏览器会对跨域资源访问进行一些限制。  

同源策略对ajax的跨域限制最为凶狠，默认情况下，不允许ajax访问跨域资源。所以我们通常所说的跨域问题，就是同源策略对ajax产生的影响。

那么在前端领域中，跨域是指浏览器允许向服务器发送跨域请求，从而克服Ajax只能同源使用的限制。

解决跨域问题有很多，常见的方法有：
- JSONP
- CORS
- 服务端中间层代理

## JSONP
JSONP的原理就是利用\<script>标签没有跨域限制，通过\<script> 标签src属性，发送带有callback参数的GET请求，服务端将接口返回数据传入到callback函数中，返回给浏览器，浏览器解析执行，从而前端拿到callback函数返回的数据。

>JSONP的缺点就是：**只能发送get请求**

```JS
<script>
    var script = document.createElement('script');
    script.type = 'text/javascript';

    // 传参一个回调函数名给后端，方便后端返回时执行这个在前端定义的回调函数
    script.src = 'http://www.domain2.com:8080/login?user=admin&callback=handleCallback';
    document.head.appendChild(script);

    // 回调执行函数
    function handleCallback(res) {
        alert(JSON.stringify(res));
    }
 </script>
```
服务器返回如下(执行回调函数)
```JS
handleCallback({"success": true, "user": "admin"})
```

## CORS
CORS是基于http1.1的一种跨域解决方案，它的全称是Cross-Origin Resource Sharing，跨域资源共享。
>总体思路就是：**如果浏览器要跨域访问服务器的资源，需要获得服务器的允许**

当浏览器端运行了一段 ajax 代码（无论是使用 XMLHttpRequest 还是 fetch api），浏览器会首先判断它属于哪一种请求模式  

针对不同的请求，CORS有三种交互模式，分别是：  
- 简单请求
- 需要预检的请求
- 附带身份凭证的请求
### 简单请求
当请求**同时满足**以下条件时，浏览器会认为它是一个简单请求  
1. 请求方法属于下面的一种： 
    - get
    - post
    - head
2. 请求头仅包含安全的字段，常见的安全字段如下：  
    - Accept
    - Accept-Language
    - Content-Language
    - Content-Type
    - DPR
    - Downlink
    - Save-Data
    - Viewport-Width
    - Width
3. 请求头如果包含Content-Type，仅限下面的值之一： 
    - text/plain
    - multipart/form-data
    - application/x-www-form-urlencoded  

如果以上三个条件同时满足，浏览器判定为简单请求。   
    
例如以下例子：
```JS
// 简单请求
fetch('http://crossdomain.com/api/news');

// 请求方法不满足要求，不是简单请求
fetch('http://crossdomain.com/api/news', {
  method: 'PUT',
});

// 加入了额外的请求头，不是简单请求
fetch('http://crossdomain.com/api/news', {
  headers: {
    a: 1,
  },
});

// 简单请求  没有设置content-type 则 默认为application/x-www-form-urlencoded
fetch('http://crossdomain.com/api/news', {
  method: 'post',
});

// content-type不满足要求，不是简单请求
fetch('http://crossdomain.com/api/news', {
  method: 'post',
  headers: {
    'content-type': 'application/json',
  },
});
```
### 简单请求交互规范
当浏览器判定某个ajax 跨域请求是简单请求时，会发生以下的事情
1. 请求头中会自动添加Origin字段
2. 服务器响应头中应包含Access-Control-Allow-Origin，该字段的值可以是：
    -  *：表示我很开放，什么人我都允许访问
    -  具体的源：比如http://my.com，表示我就允许你访问

比如，在页面 http://my.com/index.html 中有以下代码造成了跨域
```JS
// 简单请求
fetch('http://crossdomain.com/api/news');
```
请求发出后，请求头会是下面的格式：
```
GET /api/news/ HTTP/1.1
Host: crossdomain.com
Connection: keep-alive
...
Referer: http://my.com/index.html
Origin: http://my.com
```
最后一行 Origin 字段会告诉服务器，是哪个源地址在跨域请求  

当服务器收到请求后，如果允许该请求跨域访问，需要在响应头中添加Access-Control-Allow-Origin字段  

假设服务器做出了以下的响应：
```
HTTP/1.1 200 OK
Date: Tue, 21 Apr 2020 08:03:35 GMT
...
Access-Control-Allow-Origin: http://my.com
...

消息体中的数据
```
当浏览器看到服务器允许自己访问后，它就把响应顺利的交给js，以完成后续的操作。

### 需要预检的请求
简单的请求对服务器的威胁不大，所以允许使用上述的简单交互即可完成。

但是，如果浏览器不认为这是一种简单请求，就会按照下面的流程进行：

1. 浏览器发送预检请求，询问服务器是否允许
2. 服务器允许
3. 浏览器发送真实请求
4. 服务器完成真实的响应

比如，在页面http://my.com/index.html 中有以下代码造成了跨域
```
// 需要预检的请求
fetch('http://crossdomain.com/api/user', {
  method: 'POST', // post 请求
  headers: {
    // 设置请求头
    a: 1,
    b: 2,
    'content-type': 'application/json',
  },
  body: JSON.stringify({ name: '袁小进', age: 18 }), // 设置请求体
});
```

浏览器发现它不是一个简单请求，则会按照下面的流程与服务器交互
1. 浏览器发送预检请求，询问服务器是否允许
```
OPTIONS /api/user HTTP/1.1
Host: crossdomain.com
...
Origin: http://my.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: a, b, content-type
```
可以看出，这并非我们想要发出的真实请求，请求中不包含我们的请求头，也没有消息体。

这是一个预检请求，它的目的是询问服务器，是否允许后续的真实请求。

预检请求没有请求体，它包含了后续真实请求要做的事情

预检请求有以下特征：
- 请求方法为OPTIONS
- 没有请求体
- 请求头中包含 
  - Origin：请求的源，和简单请求的含义一致
  - Access-Control-Request-Method：后续的真实请求将使用的请求方法
  - Access-Control-Request-Headers：后续的真实请求会改动的请求头

2. 服务器允许
服务器收到预检请求后，可以检查预检请求中包含的信息，如果允许这样的请求，需要响应下面的消息格式  

```
HTTP/1.1 200 OK
Date: Tue, 21 Apr 2020 08:03:35 GMT
...
Access-Control-Allow-Origin: http://my.com
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: a, b, content-type
Access-Control-Max-Age: 86400
...
```
对于预检请求，不需要响应任何的消息体，只需要在响应头中添加：

- Access-Control-Allow-Origin：和简单请求一样，表示允许的源
- Access-Control-Allow-Methods：表示允许的后续真实的请求方法
- Access-Control-Allow-Headers：表示允许改动的请求头
- Access-Control-Max-Age：告诉浏览器，多少秒内，对于同样的请求源、方法、头，都不需要再发送预检请求了  

3. 服务器允许
预检被服务器允许后，浏览器就会发送真实请求了，上面的代码会发生下面的请求数据
```
POST /api/user HTTP/1.1
Host: crossdomain.com
Connection: keep-alive
...
Referer: http://my.com/index.html
Origin: http://my.com

{"name": "ximi", "age": 2 }
```
4. 浏览器发送真实请求
```
HTTP/1.1 200 OK
Date: Tue, 21 Apr 2020 08:03:35 GMT
...
Access-Control-Allow-Origin: http://my.com
...

添加用户成功
```
可以看出，当完成预检之后，后续的处理与简单请求相同

### 附带身份凭证的请求
默认情况下，ajax 的跨域请求并不会附带 cookie，这样一来，某些需要权限的操作就无法进行 


不过可以通过配置就可以实现附带 cookie
```JS
// xhr
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

// fetch api
fetch(url, {
  credentials: 'include',
});
```
这样一来，该跨域的 ajax 请求就是一个附带身份凭证的请求

当一个请求需要附带 cookie 时，无论它是简单请求，还是预检请求，都会在请求头中添加cookie字段

而服务器响应时，需要明确告知客户端：服务器允许这样的凭据

告知的方式也非常的简单，只需要在响应头中添加：Access-Control-Allow-Credentials: true 即可

对于一个附带身份凭证的请求，若服务器没有明确告知，浏览器仍然视为跨域被拒绝。

另外要特别注意的是：对于附带身份凭证的请求，服务器不得设置 Access-Control-Allow-Origin 的值为 * 。一次不推荐使用 *
## 服务端中间层代理
服务端中间层代理实际上是搭建一个与浏览器同源的服务器，从而解决浏览器的同源问题。  
服务端中间层代理 一般常见的有 nginx 和 nodejs中间件代理跨域
### nginx代理跨域
nginx代理跨域，实质和CORS跨域原理一样，通过配置文件设置请求响应头Access-Control-Allow-Origin...等字段。

通过Nginx配置一个代理服务器域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域访问。
nginx具体配置：
```JS
#proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;

    location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
```
### nodejs中间件代理跨域
node中间件实现跨域代理，原理大致与nginx相同，都是通过启一个代理服务器，实现数据的转发，也可以通过设置  cookieDomainRewrite参数修改响应头中cookie中域名，实现当前域的cookie写入，方便接口登录认证。
webpack.config.js部分配置：
```JS 
module.exports = {
    entry: {},
    module: {},
    ...
    devServer: {
        historyApiFallback: true,
        proxy: [{
            context: '/login',
            target: 'http://www.domain2.com:8080',  // 代理跨域目标接口
            changeOrigin: true,
            secure: false,  // 当代理某些https服务报错时用
            cookieDomainRewrite: 'www.domain1.com'  // 可以为false，表示不修改
        }],
        noInfo: true
    }
}
```
## 总结
jsonp（只支持get请求，支持老的IE浏览器）适合加载不同域名的js、css，img等静态资源；  

CORS（支持所有类型的HTTP请求，但浏览器IE10以下不支持）适合做ajax各种跨域请求；  

Nginx代理跨域和nodejs中间件跨域原理都相似，都是搭建一个服务器，直接在服务器端请求HTTP接口，这适合前后端分离的前端项目调后端接口。
