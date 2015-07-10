'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var runSequence = require('run-sequence');
var sprite = require('gulp-sprite-generator');


var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
    return gulp.src([
        path.join(conf.paths.src, '/app/**/*.html'),
        path.join(conf.paths.tmp, '/serve/app/**/*.html')
    ])
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'test',
            root: 'app'
        }))
        .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), {read: false});
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };

    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe(assets = $.useref.assets())
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify({preserveComments: $.uglifySaveLicense})).on('error', conf.errorHandler('Uglify'))
        .pipe(jsFilter.restore())
        //.pipe(cssFilter)
        //.pipe($.csso())
        //.pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        }))
        .pipe(htmlFilter.restore())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({title: path.join(conf.paths.dist, '/'), showFiles: true}));
});

//gulp.task('sprites', function() {
//    var spriteOutput;
//
//    spriteOutput = gulp.src("./dist/styles/*.css")
//        .pipe(sprite({
//            baseUrl:         "./dist/assets/images",
//            spriteSheetName: "sprite.png",
//            spriteSheetPath: "/dist/assets"
//        }));
//
//    spriteOutput.css.pipe(gulp.dest("./dist/styles"));
//    spriteOutput.img.pipe(gulp.dest("./dist/assets"));
//});

gulp.task('sprites', function () {
    var spriteOutput;

    spriteOutput = gulp.src("./dist/styles/*.css")
        .pipe(sprite({
            baseUrl: "./src/assets/",
            spriteSheetName: "sprite.png",
            spriteSheetPath: "../assets/images"
        }));

    spriteOutput.css
        .pipe($.csso())
        .pipe(gulp.dest("./dist/styles"));

    return spriteOutput.img.pipe(gulp.dest("./dist/assets/images"));
});

// 默认的没有图片压缩，不知道为什么会犯这个错误
gulp.task('images', function () {
    return gulp.src(['src/assets/images/**/*', 'dist/assets/images/*.png'])
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/assets/images/'));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

//把src里面的非html，css，js，scss文件copy到dist来
gulp.task('other', function () {
    var fileFilter = $.filter(function (file) {
        return file.stat.isFile();
    });

    return gulp.src([
        path.join(conf.paths.src, '/**/*'),
        path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss,png,jpg}')
    ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function (done) {
    $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

gulp.task('build1', ['html', 'fonts', 'other']);

gulp.task('build', function() {
    runSequence('build1', 'sprites', 'images');
});
