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
    connect = require('gulp-connect');

var PATH = {
    src: {
        html: 'src/html',
        css: 'src/css',
        less: 'src/less',
        sass: 'src/sass',
        js: 'src/js',
        img: 'src/img',
        font: 'src/font'
    },
    dest: {
        html: 'dest/html',
        css: 'dest/css',
        js: 'dest/js',
        img: 'dest/img',
        font: 'dest/font'
    }
}

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
    gulp.src([PATH.src.sass + '/*.scss','!' + PATH.src.sass + '/modules/**/*.scss'])
    //Type: String Default: nested Values: nested, expanded, compact, compressed
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        //.pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(PATH.dest.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(PATH.dest.css))
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
    gulp.src([PATH.src.css + '/**/*.css'])
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(PATH.dest.css));
});

//组件化的css生成
gulp.task('renderCommon', function() {
    //common.scss
    gulp.src([PATH.src.sass + 'common.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(PATH.dest.css+'common.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(PATH.dest.css+'common.css'));
    //common.less
    //gulp.src([PATH.src.less + '/common.less'])
    //    .pipe(less({ style: 'expanded'}))
    //    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //    .pipe(gulp.dest(PATH.dest.css))
    //    .pipe(rename({ suffix: '.min' }))
    //    .pipe(minifycss())
    //    .pipe(gulp.dest(PATH.dest.css));

    return console.log('common.css生成成功！');
});

// 脚本
gulp.task('scripts', function() {
    return gulp.src(PATH.src.js + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(PATH.dest.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(PATH.dest.js))
        .pipe(notify({ message: 'Scripts task complete' }));
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
    return gulp.src([PATH.dest.css, PATH.dest.js, PATH.dest.html,PATH.dest.font,PATH.dest.img], {read: false})
        .pipe(clean());
});

//合并压缩HTML
gulp.task('html', function(){
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
    return gulp.src([PATH.src.html + '/**/*.html','!' + PATH.src.html + '/modules/**/*.html'])
        .pipe(contentIncluder({
            includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
        }))
        .pipe(gulp.dest(PATH.dest.html))
        .pipe(minifyHTML(opts))
        //.pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(PATH.dest.html + '/min'));
});

//copy images
gulp.task('copyImages',function(){
    gulp.src([PATH.src.img+'/**/*'])
        .pipe(gulp.dest(PATH.dest.img));
    return console.log(PATH.src.img + '下图片复制成功');
});

//copy fonts
gulp.task('copyFonts',function(){
    gulp.src([PATH.src.font+'/**/*'])
        .pipe(gulp.dest(PATH.dest.font));
    return console.log(PATH.src.font + '下字体复制成功');
});

//web服务
gulp.task('webserver', function () {
    connect.server({
        livereload: true,
        port: 8090//,
        //host: 'gulp.dev'
        ,root: ['./dest', PATH.dest.html, '.tmp']
    });
});

// 预设任务
gulp.task('default', ['clean'], function() {
    //gulp.start('styles', 'scripts', 'images');
    gulp.start('styles', 'scripts','html','copyImages','copyFonts','watch','webserver');
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
    // 建立即时重整伺服器
    var server = livereload();
    // 看守所有位在 dest/  目录下的档案，一旦有更动，便进行重整
    gulp.watch(['dest/**']).on('change', function(file) {
        server.changed(file.path);
    });
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