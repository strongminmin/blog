---
title: 漫谈background各种属性的特性
sticky: 999
description: 漫谈background各种属性的特性
hiddenCover: false
comment: true
outline: [2,3]
tag:
 - CSS
---

# 漫谈background各种属性的特性

在CSS3样式中background中可以划分多个属性进行设置。

## background-image
background-image是设置背景的图像资源，默认值为none（始终存在，看不到而已）。

这里的图像资源，不单单指的是通常意义上理解的“图片”，而是CSS拟定的图像类模型的资源。CSS3中，图像资源有了更多的内容，因此background-image的值也变得更加多样化。

background-image的多种设定方法

1. url()----绝对或相对地址指定背景图像。

2. url()----直接用Base64编码设置背景图像。

base64编码就是一副图片的数据编码成一串字符串，使用该字符串来代替图像地址。

主要适用于单独存在的很小的图片（如平铺背景图），其目的是减少HTTP请求。

图片在线转换编码工具：http://tools.jb51.net/transcoding/img2base64。
浏览器开发者工具直接获取，代码写法：url(data:image/图片格式；base64，图片编码)

3. gradient ----指定各种渐变形式作为背景图像。

目前包括linear-gradient,repeating-linear-gradient,radial-gradient,repreating-radial-gradient

4. url(1)、url(2)、url(3)

群组值的覆盖关系：前者叠加在后者后面，以此类推。

群组值之间用,英文逗号分隔，可以是各种值的混合组合，url(1),url(2),url(3)或者url(1),gradient()。

```css
/*使用url()base64编码进行设置背景*/
.box1{
	background-image: url(data:image/jpg;base64,/9j/4QBkRXhpZgAATU0AKgAAAAgABYdpAAQAAAABAAAASgESAAQAAAABAAAAAAEBAAMAAAAB.....);
	background-size:100% 100%;
}
/*使用url相对或决定路径*/
.box2{
	background-image:url(../../image/1.jpg);
	background-size:100% 100%;
}
/*使用CSS3渐变设定background-image*/
.box3{
	background-image:radial-gradient(red,yellow);
}
/*群组值设置多重背景*/
.box4{
	background-image:url(../../image/1.jpg),
			 url(../../image/2.jpg);
	background-repeat: no-repeat;

}
.box5{
	background-size:100% 100%;
	background-image:radial-gradient(transparent 30%,currentcolor 60%),
                         url(../../image/1.jpg);
}
```

## background-attachment
background-attachment表示背景的附着方式（也可以说背景的滚动）。

由于背景依附对象的不同出现的滚动现象。有三个值。

- scroll：默认值，背景图是相对于元素自身固定，元素移动背景图滚动
- fixed：背景图相对于浏览器窗口（视口）固定
- local：背景图是相对于元素里面的内容固定，元素中的内容移动背景图跟随移动

```css
.box1{
    height:600px;
    background-image:url(1.jpg);
    background-repeat:no-repeat;
    background-attachment:scroll;   /*默认：附着在元素身上，元素怎么动，背景图就怎么动*/
    background-attachment:fixed;    /*背景图相对于浏览器视口固定*/
    background-attachment:local;    /*当容器中的文本设置纵向或者横向产生滚动条的时候，当滚动滚动条，文字动，背景图跟着动*/
    border:1px solid red;
    overflow:auto;
}
```

## background-origin
说这个之前先说一下盒模型的组成原理。

容器的构成：内容 + 内边距  +  边框

盒模型对应的3个区域：内容：content-box、内边距：padding-box、边框：border-box。

background-origin表示背景图的起始点也就是指定货背景图的起始位置定为在容器的哪个盒子中。

三个值：content-box / padding-box（默认) / border-box；

 需要注意的是：在background-attachment:fixed; 状态下无效（不依赖盒子存在，存在于浏览器的左上角，依赖视口存在），指定是背景图的定位，对backgroud-color无效。

```css
div{
    width:300px;
    height:300px;
    margin:100px auto;padding:100px;
    border:50px dotted rgba(255,0,0,.5);
    background-image:url(../../image/1.jpg);
    background-repeat:no-repeat;
    background-size:100px 100px;     
}
.box1{
    background-origin:content-box;
    background-origin:padding-box;
    background-origin:border-box;
}

```
## background-color
表示容器的背景色。

1. 默认值：transparent，不具备继承性。带有默认样式的元素，背景色值被就浏览器的预定义样式修改，如表单元素，mark标签等，可通过initial恢复默认。
2. 当与background-image同时定义时，色永远被图覆盖。
3. 配合CSS3的rgba（）或者hsla（）色彩值，创建半透明效果的背景色。
4. 配合CSS3新增的关键词currentcolor，定义可变的背景色。
5. 不能单独应用CSS3的渐变类型值（渐变属于图像类型，而非色彩定义）。

## background-repeat
background-repeat表示定义background-image的重复呈现方式。

- repeat：水平和垂直两个方向都平铺图像（默认值）。
- repeat-x：水平方向平铺图像。
- repeat-y：垂直方向平铺图像。
- no-repeat：图像不平铺，只呈现一次。
- space：图像以相同的间距平铺且填满整个容器或某个方向。
- round：图像自动缩放直至适应且填充满整个容器


**space值的特点**

背景图以容器的四周边缘为基准对齐平铺，多出来的空间用空白代替，图像本身保持原尺寸不变，用等分距来控制背景图平铺可能产生的空白区域。
		
**round值的特点**

背景图以容器的四周边缘为基准对齐平铺，多出来的空间用图片自适应的缩放来填充，图像会根据需要进行自适应缩放（不同游览器判断可能有误差），自适应缩放并不是等比的关系，图像可能会变形。

background-repeat两个值的写法
- 允许提供两个参数，第一个定义水平方向，第二个定义垂直方向
- repeat-x或repeat-y等于默认设定了固定的两个值，无法与其他值搭配使用
- 主要用于新增的space和round的值的搭配

**重点及总结**

- 原有的值，保持玩法不变
- 新增的space和round都是为了让图片更适应容器尺寸而生，其平铺的标准均以容器边缘对齐
- 新增值space和round都常见用于小背景图（小于容器尺寸）或尺寸自适应的容器
- 新增额space和round的区别重点在于背景图是否能够自适应缩放
- 2个值的定义方法，实际应用也只要是配合新增值space和round

```css
/*space值的设定*/
.box1{
	background-image:url(../../image/1.jpg);
	background-repeat:no-repeat;
	background-repeat:space;
	background-size:80px 80px;
}
/*round值的特点*/
.box2{
	background-image:url(../../image/1.jpg);
	background-repeat:no-repeat;
	background-repeat:round;
	background-size:80px 80px;
}
/*两个值的定义方式*/
.box3{
	background-size:80px 80px;
	background-image:url(../../image/1.jpg);
	/*background-repeat:repeat repeat;*/
	background-repeat:space no-repeat;
}

```

## background-position
background-position用来精确定位背景图出现的位置（从左上角 0 0 开始计量）。

值得设置：

- 值得范围：关键字（left、right、top、bottom、center）/偏移量（px，%）
- 原有设定2个值，分别代表水平距离坐标和垂直距离坐标
  - 如果只写1个值，则第二个值默认为center。
  - 可以设为负值

CSS3新增四个值的设置：

- 【关键字 + 偏移量】2个值为一组，代表一个方向，共2组即4个值
- 偏移量前必须有关键字，可以简写但顺序是既定的
  - 水平方向  right  20px  垂直方向   bottom  20px 
- 属性值为三个值得时候 偏移量在前不生效，必须偏移方向在前才能生效

background-position-x 和background-position-y可以忽略掉。

```css
.box2{
    height:500px;
    width:800px;
    border: 1px solid red;
    background-image:url(../../image/1.jpg);
    background-size:100px 100px;
    background-repeat:no-repeat;
    /* background-position:right 0px bottom 0px; */
    background-position: 30px bottom 10px;      /*三个值 偏移量在前不生效，必须偏移防线在前*/
    background-position: left 30px bottom;
}
.text{
    background-image:url(../../image/1.jpg);
    background-repeat:no-repeat;
    background-size:100px 100px;
    width:300px;
    height:280px;
    background-position:right 0 bottom 0 ; 
}

```

## background-clip
指定对象的背景图像向外裁剪的区域（设定背景所覆盖的范围）。

- border-box：默认值，背景覆盖整个盒子区域
- padding-box：背景仅覆盖padding区域
- content-box：背景仅覆盖content区域
- text：webkit特有值，背景仅覆盖文字区域

需要注意的是：

1. 对背景色、渐变值、背景图均有效：clip控制的是裁剪的区域，因此无所谓背景是什么类型。
2. 裁剪的范围是被覆盖之外的范围，因此图像可视区区域会变小而非移动位置。
3. 对文档的根元素无效：html标签可以看作是整个页面的大画布，其背景呈现区域本质上就是大画布的区域，所以无法通过属性来改变。body标签对应浏览器视口，在html标签为设置时，body通常都是被视为根元素上被指定的值。当html根标签设置了的时候，body标签设置clip有效。

```css
.box1{
			background-clip:border-box;
}
.box2{
			background-clip:padding-box;
}
.box3{
			background-clip:content-box;
}

```

## background-size
background-size用于设定background-image的尺寸大小。

- auto：默认值，保持背景图的原始高度和宽度
- 数值（带单位）：定义背景图具体的宽度和高度，允许设置1个值或者2个值。
- %：定义背景图的%大小，允许设置1个值或2个值
- cover：背景图会根据需要等比缩放，以实现覆盖容器背景区域（背景图像有可能超出容器）（有可能以宽缩放、有可能以高缩放）
- contain：将背景图像等比缩放到宽度或高度与容器的宽度和高度相等（背景图像始终在容器内）

background-size值的特点：

- 值为数值或者%时，允许设定1个值或者2个值，但不能设定负值（尺寸是一个真实存在的东西）。
	- 1个值：该值定义为宽度，第二个值设定高度默认为auto，即，背景图以提供的宽度作为参照物进行等比缩放
	- 2个值：第一个用于定义背景图像的宽度，第二个用于定义背景图像的高度。
			
- 值为cover或contain时：
	- 两者都以适应容器尺寸为目地，进行等比缩放
		- cover以占满容器区域为目的，图片可能拉伸或者被剪裁
		- contain以完整呈现于容器区域内为目的，图片可能缩小或区域内留空白。
	- cover值：主要适用于图片小于容器，又无法使用background-repeat
		- cover常用来实现一张背景图在不同分辨大小的浏览器下显示满屏的效果
	- contain：主要适用于图片大于容器，而又需要把背景图片全部显示出来。

```css
.box1{
	background-size:auto;
}
.box2{
	background-size:100px 100px;
}
.box3{
	background-size:100px;
}
.box4{
	background-size:100% 100%;
}
.box5{
	background-size:100%;
}
.box6{
	background-size:cover;
}
.box7{
	background-size:contain;
}

```

## 总结：背景的复合属性

总的来说background是上面8个属性的总和...可以把所有属性写在一起，也可以只写需要设定的相关属性，顺序不限，值以空格隔开即可。

没有设置的值即被认为是默认值，之后也可以单独设置（后者优先）。

background: color image repeat attachment position/size origin clip;
如果需要定义size，size必须跟在position后面并以/分隔，（position/size）。

origin和clip
- 如果只设定一个值，则同时应用到两个属性上。
- 如果设定了两个值，则前者为origin的值，后者为clip

```css
.box1{
	/*全部复写，定位和尺寸是固定的写法;origin和clip的值可以共用，也可以分开，顺序不能颠倒*/
	background:green url(../../image/1.jpg) no-repeat 0 0/contain border-box padding-box;
}
.box2{
	/*多重背景的设置下：一句代码就是一个图片的所有属性的复写*/
background:
		url(../../image/1.jpg) no-repeat 0 0/contain border-box,
		url(../../image/2.jpg) no-repeat 0 0/cover border-box;
}
```
