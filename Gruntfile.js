module.exports = function(grunt) {

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: 'static',
                    keepalive: false
                }
            }
        },
        sass: {                          
            dist: {      
                files: {
                    'static/_includes/css/style.css': 'static/_includes/scss/styles.scss',
                }
            }
        },
        watch: {
            styles: {
                files: 'static/_includes/scss/*.scss',
                tasks: ['sass'],
                options: {
                  debounceDelay: 1000
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['connect', 'watch']);
};