# gf-pc

广发证券angularjs前端框架
============================

选用的基本种子是[generator-gulp-angular（v0.12.1）](https://github.com/Swiip/generator-gulp-angular)

理由：

讨论活跃，更新频繁，支持度比较高。后面此版本会follow原版的更新

安装完成后，发现目前的版本还是存在一些缺陷，这里进行了如下的改造。

用法
--------------------------------------------------
```javascript
bower install
npm install
```

原种子技术选型
--------------------------------------------------
安装参考[generator-gulp-angular](https://github.com/Swiip/generator-gulp-angular)

* Angular: 1.4.0 **1.3.x**
* Angular modules: **animate, cookies, touch, sanitize**
* jQuery: jQuery 1.x, 2.x, Zepto, **none**
* Resource handler: **ngResource**, Restangular, none
* Router: ngRoute, **UI Router**, none
* UI Framework: Bootstrap, Foundation, Angular Material, **none** (depends on the chosen CSS preprocessor)
* CSS pre-processor: Less, Sass(Ruby), **Sass(Node)**, Stylus, none
* JS preprocessor: CoffeeScript, TypeScript, ECMAScript 6 (Traceur), **ECMAScript 6 (Babel)**, none
* HTML preprocessor: Jade, Haml, Handlebars, **none**


修改说明
--------------------------------------------------

1、 整合进了[gulp-sprite-generator](https://github.com/gobwas/gulp-sprite-generator)，依赖的是dist里面的css和src里面的图片，拼合后存放于dist中
```javascript
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
```

2、图片压缩。如果你使用的是es6的模板，在build里面是没有图片压缩的

```javascript
gulp.task('images', function () {
    return gulp.src(['src/assets/images/**/*', 'dist/assets/images/*.png'])
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/assets/images/'));
});
```

3、build的task也有修改。由于图片的拼合依赖build1的执行完成，所以这里使用了runSequence来保证同步执行

```javascript
gulp.task('build1', ['html', 'fonts', 'other']);

gulp.task('build', function() {
    runSequence('build1', 'sprites', 'images');
});
```

4、该模板如果新建了controller，service等，需要在index.module.js里面手动添加。

5、这里目前没有采用oclazyload这种按页码加载资源的方式，而是在build之后会将所有的css和js都各自合并成一个文件。这个结论是基于目前项目还不算太复杂，资源文件的体积不会太大的方面来考虑的。
