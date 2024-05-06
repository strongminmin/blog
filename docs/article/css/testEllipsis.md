---
title: CSS：文本内容超出省略号
sticky: 999
description: CSS：文本内容超出省略号
hiddenCover: false
comment: true
outline: [2,3]
tag:
 - css
---
# CSS：文本内容超出省略号

## 单行文本超出省略
```CSS
overflow: hidden; //超出的隐藏
text-overflow: ellipsis; //省略号
white-space: nowrap; //强制一行显示
```
## 如果要强制两行的话，得用到css3的知识
```CSS
overflow:hidden;

text-overflow:ellipsis;

display:-webkit-box;

-webkit-box-orient:vertical;

-webkit-line-clamp:2;
```

如果在实际项目中发现-webkit-box-orient没有生效，需要加入如下注释:

/*! autoprefixer: off */

```CSS
overflow:hidden;

text-overflow:ellipsis;

display:-webkit-box;

/*! autoprefixer: off */
-webkit-box-orient:vertical;

-webkit-line-clamp:2;
```