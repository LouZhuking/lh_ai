# Hulk Chrome扩展

一个简单的Chrome扩展，可以将网页背景颜色更改为绿色。

## 功能特点

- 点击扩展图标打开弹出窗口
- 在弹出窗口中点击按钮将当前页面背景更改为绿色

## 安装步骤

1. 打开Chrome浏览器，进入扩展管理页面：`chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择包含此扩展的文件夹（hulk文件夹）

## 使用方法

1. 点击Chrome工具栏中的Hulk扩展图标
2. 在弹出的窗口中点击"改变背景颜色"按钮
3. 当前页面的背景将变为绿色

## 文件结构

- `manifest.json`: 扩展配置文件
- `popup.html`: 弹出窗口界面
- `popup.js`: 弹出窗口功能实现
- `icons/`: 扩展图标文件夹 