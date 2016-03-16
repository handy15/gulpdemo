##gulp工程目的？
作为gulp初学者，摸索前进地小小战利品，O(∩_∩)O~

##该项目的工具

###LiveReload配置
1. 装Chrome LiveReload
2. 通过npm安装http-server ，快速建立http服务
    $ npm install http-server -g
3. 通过cd找到发布环境目录dist
4. 运行http-server，默认端口是8080
    $ http-server
5. 访问路径localhost:8080
6. 再打开一个cmd，通过cd找到项目路径执行gulp，清空发布环境并初始化
7. 执行监控 gulp
8. 点击chrome上的LiveReload插件，空心变成实心即关联上，你可以修改css、js、html即时会显示到页面中。

###版本控制插件修改（gulp-rev、gulp-rev-collector）
插件效果："/css/style.css" => "/dist/css/style-1d87bebe.css"
预期效果："/css/style.css" => "/dist/css/style.css?v=1d87bebe"
1. 打开 node_modules\gulp-rev\index.js，第133行 manifest[originalFile] = revisionedFile; 更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;
2. 打开 nodemodules\gulp-rev\nodemodules\rev-path\index.js，10行 return filename + '-' + hash + ext; 更新为: return filename + ext;
3. 打开 node_modules\gulp-rev-collector\index.js，31行 if ( path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) !== path.basename(key) ) {，更新为: if ( path.basename(json[key]).split('?')[0] !== path.basename(key) ) {


##关于作者

```javascript
  var handy = {
    nickName  : "mysun",
    blog : "http://blog.csdn.net/jimmyhandy"
  }
```
