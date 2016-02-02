module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        distdir: '../zone1',
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                build: {
                    src: ['../js/fl.js'],
                    dest: '<%= distdir %>/js/fl.min.js'
                }
            },
            vendor: {
                options: {
                    preserveComments: 'some' // Preserve license comments
                },
                src: ['bower_components/angular-facebook/lib/angular-facebook.js'],
                dest: '<%= distdir %>/js/vendor/angular-facebook/angular-facebook.min.js'
            }
        },
        clean: {
            all: ['<%= distdir %>/*'],
            js: ['<%= distdir %>/js/*']
        },
        copy: {
            vendor: {
                files: [{
                    expand: true,
                    cwd: 'bower_components',
                    src: ['angular/angular.min.js', 'angular-route/angular-route.min.js'],
                    dest: '<%= distdir %>/js/vendor/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'bower_components/jquery/dist/',
                    src: ['jquery.min.js', 'jquery.min.map'],
                    dest: '<%= distdir %>/js/vendor/jquery/',
                    filter: 'isFile'
                }]
            },
            css: {
                files: [{
                    expand: true,
                    cwd: '..',
                    src: ['css/*'],
                    dest: '<%= distdir %>/'
                }]
            },
            php: {

            },
            template: {

            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['uglify:dist']);
    grunt.registerTask('build', ['clean:all', 'uglify:vendor', 'copy:vendor']);

};
