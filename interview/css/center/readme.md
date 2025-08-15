## 引言

## 居中

### 居中元素固定宽高

下面三种方式兼容性很好，缺点是需要知道元素的宽高

#### 1.absolute + 负 margin

```
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -50px;
  margin-top: -50px;
}
```

#### 2.absolute + margin auto

```
.parent{
  position: relative;
}
.child{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

#### 3.absolute + calc

```
.parent{
  position: relative;
}
.child{
  position: absolute;
  top: calc(50% - 50px);
  left: calc(50% - 50px);
}


```

### 居中元素不定宽高

#### 1.absolute + transform

```
.parent{
  position: relative;
}
.child{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

#### 2.line-height(水平居中) + vertical-align(垂直居中)

\*\* display: inline-block;

```
<!-- 定位代码 -->
.parent{
  line-height: xxx px; /* 行高等于高度 */
  text-align: center;
}
.child{
  display: inline-block;
  vertical-align: middle;
  line-height: initial; /* 重置行高，避免继承父元素的行高 */
  text-align: left;
}
```

#### 3.write-mode(重点看下不太熟悉)

/_ 定位代码 _/
.wp {
writing-mode: vertical-lr;
text-align: center;
}
.wp-inner {
writing-mode: horizontal-tb;
display: inline-block;
text-align: center;
width: 100%;
}
.box {
display: inline-block;
margin: auto;
text-align: left;
}

#### 4. table

```
<table>
    <tbody>
        <tr>
            <td class="wp">
                <div class="box">123123</div>
            </td>
        </tr>
    </tbody>
</table>
```

```
.wp{
  text-align: center;
}
.box{
  display: inline-block;
}
```

table 单元格中的内容天然就是垂直居中的，只要添加一个水平居中属性就好了

#### 5. css-table

```
.parent{
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
.children{
  display:inline-block;
}
```

#### 6. flex

```
.parent{
  display: flex;
  justify-content: center;
  align-items: center;

}
```

#### 7. grid

```
.parent{
  display: gird;
}
.child{
  align-self: center;
  justify-self: center;
}
```
