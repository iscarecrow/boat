var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    reactify = require('reactify'),
    watchify = require('watchify'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    runSequence = require('gulp-run-sequence'),
    uglify = require('gulp-uglify');

gulp.task('boat-browserify', function() {
    gulp.src(['./static/boat/js/main-letter-list.js'])
        .pipe(browserify({
            debug: false,
            transform: ['reactify']
        }))
        .pipe(gulp.dest('./static/boat/js/'));
});


gulp.task('browserify', function() {
    var bundler = browserify({
        entries: ['./src/boat/js/main-letter-app.js'], // Only need initial file, browserify finds the deps
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: true, // Gives us sourcemapping
        cache: {},
        packageCache: {},
        fullPaths: true // Requirement of watchify
    });
    var watcher = watchify(bundler);

    return watcher
        .on('update', function() { // When any files update
            var updateStart = Date.now();
            console.log('Updating!');
            watcher.bundle() // Create new bundle that uses the cache for high performance
                .pipe(source('main.js'))
                // This is where you add uglifying etc.
                .pipe(gulp.dest('./static/boat/js/'));
            console.log('Updated!', (Date.now() - updateStart) + 'ms');
        })
        .bundle() // Create the initial bundle when starting the task
        .pipe(source('main.js'))
        .pipe(gulp.dest('./static/boat/js/'));
});


gulp.task('boat', function(cb) {
  runSequence('boat-cssmin','boat-jsmin',cb);
});