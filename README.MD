##gulp工程目的？
作为gulp初学者，摸索前进地小小战利品，O(∩_∩)O~

##使用了那些npm

* gulp-uglify：通过UglifyJS来压缩JS文件
* gulp-concat：合并JS
* gulp-less：将less预处理为css
* gulp-sass：将sass预处理为css–不易安装成功，下载地址：https://www.npmjs.com/package/gulp-sass
* gulp-autoprefixer：使用Autoprefixer来补全浏览器兼容的css。
* gulp-minify-css：压缩css。
* connect-history-api-fallback：开发angular应用必须，用于支持HTML5 history API。
* gulp-htmlmin：简化HTML文件，[查看用法](https://www.npmjs.com/package/gulp-htmlmin)
* gulp-content-includer：HTML模块化引入的HTML合并，重新生成html
* gulp-jshint：js错误检测
* gulp-connect：创建web服务插件(与 grunt-contrib-connect 一样),这个简单的 web 服务器以当前 gulpfile.js 文件所在的文件夹作为网站根目录
* gulp-watch：只监控生成后的文件
* CoffeeScript：把编译的 Javascript 文件暂存在某个临时目录中
* gulp-rev:更改版本名
* gulp-rev-collector:gulp-rev的插件，用于html魔板更改引用的路径
* gulp-run-sequence：串行gulp任务

##有问题反馈
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流

* 邮件(814583935#gmail.com, 把#换成@)
* QQ: 814583935
* 博客: [jimmyhandy](http://blog.csdn.net/jimmyhandy)

##执行gulp任务
gulp taskName，如gulp clean、gulp watch等等

如果执行gulp，则执行开发调试预设的任务：
```javascript
// 预设任务
gulp.task('default', ['clean'], function() {
    //gulp.start('styles', 'scripts', 'images');
    gulp.start('styles', 'scripts','html','watch');
});
```
如果执行gulp，则执行开发调试预设的任务：
```javascript
// 预设任务
gulp.task('default', ['clean'], function() {
    //gulp.start('styles', 'scripts', 'images');
    gulp.start('styles', 'scripts','html','watch');
});
```

##目录说明
gulp
|__node_modules     # gulp插件，通过在gulp文件夹下执行npm install，读取package.json中的dependencies和devDependencies配置安装插件
|__gulpfile.js      # gulp通过gulpfile文件来完成相关任务，因此项目中必须包含gulpfile.js
|__README.MD        # 工程说明
|__design           # 设计图
|__dest             # 经过gulp编译，生成开发调试包的目录
|__release          # 经过gulp编译压缩,添加MD5版本号，生成发布包的目录
|__src              # 前端代码的源码目录
    |__css          # css文件目录
    |__fonts        # 字体文件目录
    |__html         # html文件目录
        |__modules  # 公共html模块目录，如header、footer等
    |__img          # 图片文件目录
    |__js           # 脚本文件
    |__less         # 预编译css的less文件
    |__sass         # 预编译css的scss文件


##浏览地址
localhost:8090/index.html


##知识扩展
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
