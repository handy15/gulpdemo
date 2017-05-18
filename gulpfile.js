// 载入外挂
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    less = require('gulp-less'),
    minifyHTML = require('gulp-htmlmin'),
    contentIncluder = require('gulp-content-includer'),
    connect = require('gulp-connect'),//gulp-webserver
    rev = require('gulp-rev'),  //版本控制
    revCollector = require('gulp-rev-collector')
    //串行任务
    ,runSequence = require('gulp-run-sequence')
    //替换路径
    ,replace = require('gulp-replace')
    ,plumber = require('gulp-plumber');

var PATH = {
    //源码目录
    src: {
        html: 'src/html',
        css: 'src/css',
        less: 'src/less',
        sass: 'src/sass',
        js: 'src/js',
        img: 'src/img',
        font: 'src/font',
        plugin: 'src/plugin'
    },
    //调试目录
    dest: {
        html: 'dest/html',
        css: 'dest/css',
        js: 'dest/js',
        img: 'dest/img',
        font: 'dest/font',
        plugin: 'dest/plugin'
    }
    //MD5版本号目录
    ,MD5:{
        html: 'dest/rev/html',
        css: 'dest/rev/css',
        js: 'dest/rev/js',
        img: 'dest/rev/img',
        font: 'dest/rev/font',
        plugin: 'dest/rev/plugin'
    }
    //发版目录
    ,rev:{
        html: 'release/html',
        css: 'release/css',
        js: 'release/js',
        img: 'release/img',
        font: 'release/font',
        plugin: 'release/plugin'
    }
}
var finallyPath = '/gulpdemo';
var reg = new RegExp("((\"|'|url\\()" + finallyPath + "/plugin[^\"']*)" + finallyPath,'g');
//'href="/gulpdemo/plugin/bootstrap-3.3.5/gulpdemo/css/bootstrap.css?v=957474c344">/gulpdemo/plugin/bootstrap-3.3.5/gulpdemo/css/'.replace(reg,"$1");

//var watch = require('gulp-watch'),
//    coffee = require('gulp-coffee');

//只负责监控（通过 gulp-watch 插件）编译后的文件的变化，并在浏览器中刷新它们
//gulp.task('livereload', function() {
//    gulp.src(['.tmp/styles/*.css', '.tmp/scripts/*.js'])
//        .pipe(watch())
//        .pipe(connect.reload());
//});

//gulp.task('coffee', function() {
//    gulp.src('scripts/*.coffee')
//        .pipe(coffee())
//        .pipe(gulp.dest('.tmp/scripts'));
//});

//gulp.task('watch', function() {
//    gulp.watch('styles/*.less', ['less']);
//    gulp.watch('scripts/*.coffee', ['coffee']);
//})

// 样式
gulp.task('styles', function() {
    //sass
    return gulp.src([PATH.src.sass + '/*.scss','!' + PATH.src.sass + '/modules/**/*.scss'])
    //Type: String Default: nested Values: nested, expanded, compact, compressed
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        //.pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(PATH.dest.css))
        //.pipe(rename({ suffix: '.min' }))
        //.pipe(minifycss())
        //.pipe(gulp.dest(PATH.dest.css))
        //.pipe(notify({ message: 'Styles task for sass complete' }));
    //less
    //gulp.src([PATH.src.less + '/*.less','!' + PATH.src.less +'/modules/**/*.less'])
    //    .pipe(less({ style: 'expanded'}))
    //    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //    .pipe(gulp.dest(PATH.dest.css))
    //    .pipe(rename({ suffix: '.min' }))
    //    .pipe(minifycss())
    //    .pipe(gulp.dest(PATH.dest.css))
    //    //.pipe(notify({ message: 'Styles task for less complete' }));

    //css
    //gulp.src([PATH.src.css + '/**/*.css'])
    //    .pipe(rename({ suffix: '.min' }))
    //    .pipe(minifycss())
    //    .pipe(gulp.dest(PATH.dest.css));
});

//组件化的css生成
gulp.task('renderCommon', function() {
    //common.scss
    return gulp.src([PATH.src.sass + '/common.scss'])
        .pipe(sass({outputStyle: 'expended'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(PATH.dest.css))
        //.pipe(rename({ suffix: '.min' }))
        //.pipe(minifycss())
        //.pipe(gulp.dest(PATH.dest.css));
    //common.less
    //gulp.src([PATH.src.less + '/common.less'])
    //    .pipe(less({ style: 'expanded'}))
    //    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //    .pipe(gulp.dest(PATH.dest.css))
    //    .pipe(rename({ suffix: '.min' }))
    //    .pipe(minifycss())
    //    .pipe(gulp.dest(PATH.dest.css));
});

// 脚本
gulp.task('scripts', function() {
    gulp.src([PATH.src.js + '/utility.js',PATH.src.js + '/common.js'])
        .pipe(jshint())
        //.pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(PATH.dest.js))
        //.pipe(rename({ suffix: '.min' }))
        //.pipe(uglify())
        //.pipe(gulp.dest(PATH.dest.js))
        //.pipe(notify({ message: 'Scripts task complete' }));
    gulp.src([PATH.src.js + '/**/*.js','!'+PATH.src.js+'/*.js'])
        .pipe(jshint())
        .pipe(gulp.dest(PATH.dest.js));
    //jquery
    gulp.src([PATH.src.js+'/jquery-1.12.1.js',PATH.src.js+'/jquery-migrate-1.1.1.js',PATH.src.js+'/vue.js'])
        .pipe(jshint())
        .pipe(gulp.dest(PATH.dest.js));
});
//插件
gulp.task('plugin',function(){
    gulp.src([PATH.src.plugin+'/**/*'])
        .pipe(jshint())
        .pipe(gulp.dest(PATH.dest.plugin));
});

// 图片
//gulp.task('images', function() {
//    return gulp.src('src/img/**/*')
//        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
//        .pipe(gulp.dest('dest/img'))
//        .pipe(notify({ message: 'Images task complete' }));
//});

// 清理
gulp.task('clean', function() {
    //return gulp.src([PATH.dest.css, PATH.dest.js, PATH.dest.html,PATH.dest.font,PATH.dest.img,'dest/rev','dest/index.html'], {read: false})
    return gulp.src(['dest'], {read: false})
        .pipe(clean());
});

//解析嵌套HTML
gulp.task('html', function(){
    return gulp.src(['src/**/*.html','!' + PATH.src.html + '/modules/**/*.html'])
        .pipe(contentIncluder({
            includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(gulp.dest('dest'));
});

//copy images
gulp.task('copyImages',function(){
    return gulp.src([PATH.src.img+'/**/*'])
        .pipe(gulp.dest(PATH.dest.img));
});

//copy fonts
gulp.task('copyFonts',function(){
    return gulp.src([PATH.src.font+'/**/*'])
        .pipe(gulp.dest(PATH.dest.font));
});

//web服务
gulp.task('webserver', function () {
    connect.server({
        livereload: true,
        port: 8090//,
        //host: 'gulp.dev'
        //,root: ['./dest', PATH.dest.html, '.tmp']
        ,root: ['./dest', '.tmp']
    });
});

// 预设任务
gulp.task('default', ['clean'], function() {
    //gulp.start('styles', 'scripts', 'images');
    gulp.start('styles', 'scripts','plugin','html','copyImages','copyFonts','watch','webserver');
});

// 看守
gulp.task('watch', function() {
    // 看守所有.scss档
    gulp.watch([PATH.src.css + '/**/*.css',PATH.src.sass + '/**/*.scss','!' + PATH.src.sass +  +'/modules/**/*.scss','!' + PATH.src.less +'/modules/**/*.less'], ['styles']);
    //看守sass组件
    gulp.watch([PATH.src.sass + '/modules/**/*.scss',PATH.src.less + '/modules/**/*.less'], ['renderCommon']);

    // 看守所有.js档
    gulp.watch(PATH.src.js +'/**/*.js', ['scripts']);
    // 看守所有图片档
    //gulp.watch('src/img/**/*', ['images']);
    gulp.watch([PATH.src.img+'/**/*'],['copyImages']);

    //看守字体文件
    gulp.watch([PATH.src.font+'/**/*'],['copyFonts']);

    // 看守所有HTML档
    gulp.watch(PATH.src.html +'/**/*.html', ['html']);
    gulp.watch('src/index.html', ['html']);
    // 建立即时重整伺服器
    var server = livereload();
    // 看守所有位在 dest/  目录下的档案，一旦有更动，便进行重整
    gulp.watch(['dest/**']).on('change', function(file) {
        server.changed(file.path);
    });
});

///////////////////////////发版，添加版本号
gulp.task('cleanRelease', function() {
    return gulp.src(['release'], {read: false})
        .pipe(clean());
});
gulp.task('cleanRev',function(){
    return gulp.src(['dest/rev'],{read:false})
        .pipe(clean());
});
// 样式 添加版本号
//经过优化和版本控制的css输出到rev文件夹里。最后再用rev.manifest，将对应的版本号用json表示出来
gulp.task('revStyles', function() {
    //css
    return gulp.src(['dest/rev/**/*.json',PATH.dest.css + '/**/*.css'])
        .pipe(rev())
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(PATH.rev.css))
        .pipe(rev.manifest())
        .pipe(gulp.dest(PATH.MD5.css));
});

// 脚本
gulp.task('revScripts', function() {
    gulp.src([PATH.dest.js + '/**/*.js','!'+PATH.dest.js + '/**/data/*.js'])
        .pipe(rev())
        .pipe(uglify())
        //.on('error', function (e) {
        //    console.log(e)
        //})
        .pipe(gulp.dest(PATH.rev.js))
        .pipe(rev.manifest())
        .pipe(gulp.dest(PATH.MD5.js));

    //json数据的js发布
    gulp.src([PATH.dest.js + '/**/data/*.js'])
        .pipe(rev())
        .pipe(gulp.dest(PATH.rev.js))
        .pipe(rev.manifest())
        .pipe(gulp.dest(PATH.MD5.js));
});

//copy images
gulp.task('revCopyImages',function(){
    return gulp.src([PATH.dest.img+'/**/*'])
        .pipe(rev())
        .pipe(gulp.dest(PATH.rev.img))
        .pipe(rev.manifest())
        .pipe(gulp.dest(PATH.MD5.img));
});

//插件
gulp.task('revPluginStyles', function() {
    //插件css
    return gulp.src(['dest/rev/**/*.json',PATH.dest.plugin + '/**/*.css'])
        //.pipe(rev())
        .pipe(revCollector({
            replaceReved: false
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(PATH.rev.plugin))
        //.pipe(rev.manifest())
        //.pipe(gulp.dest(PATH.MD5.plugin));
});
gulp.task('revPluginCopyOthers',function(){
    //插件其他
    return gulp.src([PATH.dest.plugin+'/**/*','!' + PATH.dest.plugin + '/**/*.js','!' + PATH.dest.plugin + '/**/*.css'])
        //.pipe(rev())
        .pipe(gulp.dest(PATH.rev.plugin))
        //.pipe(rev.manifest())
        //.pipe(gulp.dest(PATH.MD5.plugin));
});
gulp.task('revPluginScript',function(){
    //脚本
    return gulp.src(PATH.dest.plugin + '/**/*.js')
        //.pipe(rev())
        .pipe(uglify())
        .pipe(gulp.dest(PATH.rev.plugin))
        //.pipe(rev.manifest())
        //.pipe(gulp.dest(PATH.MD5.plugin));
});
//MD5版本号
gulp.task('revMD5',function(){
    return gulp.src(PATH.dest.plugin+'/**/*')
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest(PATH.MD5.plugin));
});

//copy fonts
gulp.task('revCopyFonts',function(){
    return gulp.src([PATH.dest.font+'/**/*'])
        .pipe(rev())
        .pipe(gulp.dest(PATH.rev.font))
        .pipe(rev.manifest())
        .pipe(gulp.dest(PATH.MD5.font));
});

//合并压缩HTML、更新引入文件版本
gulp.task('revHtml', function(){
    var opts = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        //collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        //removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        //removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        //removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    //src引入一个数组，前一个是引入刚才生成的json文件，后一个是需要更改的html模板，当然我这里是jsp。然后replaceReved: true就可以成功替换了。
    // 最后将替换过的文件输出即可，这里我输出到了原来引入的路径，这样就可以成功替换了。
    // 如果你在开发的时候需要不断调试，还可以加上gulp.watch，实时监控文件变化，然后动态做出响应。当然还是推荐开发与上线分开不同的文件夹进行管理。
    gulp.src(['dest/rev/**/*.json','dest/**/*.html'])
        .pipe(plumber())
        .pipe(revCollector({
            replaceReved: true
            //,dirReplacements: {
            //    'css': '/dist/css/',
            //    'js/': '/dist/js/',
            //    'cdn/': function(manifest_value) {
            //        return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
            //    }
            //}
        }))
        .pipe(minifyHTML(opts))
        .pipe(replace(/(\/(html|img|css|plugin|js)\/)|(\/index.html)/g, finallyPath + '$&'))
        .pipe(replace(reg, '$1'))
        .pipe(gulp.dest('release'));

    return console.log(PATH.dest.html + '下html生成开始');
});
gulp.task('release', ['clean','cleanRelease'], function() {
    runSequence(['styles', 'scripts', 'html', 'copyImages', 'copyFonts','plugin'],['revMD5'],['revCopyFonts','revCopyImages','revPluginCopyOthers','revScripts','revPluginScript'],['revStyles','revPluginStyles'],['revHtml']);
});

///////////////////////////发版，初始化
gulp.task('revStylesInit', function() {
    //css
    return gulp.src([PATH.dest.css + '/**/*.css'])
        .pipe(minifycss())
        .pipe(gulp.dest(PATH.rev.css));
});

// 脚本
gulp.task('revScriptsInit', function() {
    gulp.src(PATH.dest.js + '/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(PATH.rev.js));
});
//插件
gulp.task('revPluginInit', function() {
    //css
    gulp.src([PATH.dest.plugin + '/**/*.css'])
        .pipe(minifycss())
        .pipe(gulp.dest(PATH.rev.plugin));
    //脚本
    gulp.src(PATH.dest.plugin + '/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(PATH.rev.plugin));
    //其他
    gulp.src([PATH.dest.plugin+'/**/*',!PATH.dest.plugin + '/**/*.js',!PATH.dest.plugin + '/**/*.css'])
        .pipe(gulp.dest(PATH.rev.plugin));
});
//copy images
gulp.task('revCopyImagesInit',function(){
    return gulp.src([PATH.dest.img+'/**/*'])
        .pipe(gulp.dest(PATH.rev.img));
});

//copy fonts
gulp.task('revCopyFontsInit',function(){
    return gulp.src([PATH.dest.font+'/**/*'])
        .pipe(gulp.dest(PATH.rev.font));
});

//合并压缩HTML、更新引入文件版本
gulp.task('revHtmlInit', function(){
    var opts = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        //collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        //removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        //removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        //removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    //src引入一个数组，前一个是引入刚才生成的json文件，后一个是需要更改的html模板，当然我这里是jsp。然后replaceReved: true就可以成功替换了。
    // 最后将替换过的文件输出即可，这里我输出到了原来引入的路径，这样就可以成功替换了。
    // 如果你在开发的时候需要不断调试，还可以加上gulp.watch，实时监控文件变化，然后动态做出响应。当然还是推荐开发与上线分开不同的文件夹进行管理。
    gulp.src(['dest/rev/**/*.json','dest/**/*.html'])
        .pipe(plumber())
        .pipe(minifyHTML(opts))
        .pipe(replace(/(\/(html|img|css|plugin|js)\/)|(\/index.html)/g, finallyPath + '$&'))
        .pipe(replace(reg, '$1'))
        .pipe(gulp.dest('release'));

    return console.log(PATH.dest.html + '下html生成开始');
});
gulp.task('releaseInit', ['clean','cleanRelease'], function() {
    runSequence(['styles', 'scripts', 'html', 'copyImages', 'copyFonts','plugin'],['revCopyFontsInit','revCopyImagesInit','revScriptsInit','revPluginInit','revStylesInit','revHtmlInit']);
});

// 监听任务 运行语句 gulp watch
//gulp.task('watch',function(){
//
//    server.listen(port, function(err){
//        if (err) {
//            return console.log(err);
//        }
//
//        // 监听html
//        gulp.watch('./src/*.html', function(event){
//            gulp.run('html');
//        })
//
//        // 监听css
//        gulp.watch('./src/scss/*.scss', function(){
//            gulp.run('css');
//        });
//
//        // 监听images
//        gulp.watch('./src/images/**/*', function(){
//            gulp.run('images');
//        });
//
//        // 监听js
//        gulp.watch('./src/js/*.js', function(){
//            gulp.run('js');
//        });
//
//    });
//});