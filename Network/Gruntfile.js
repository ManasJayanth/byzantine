var filesToBeLinted = ['Gruntfile.js', 'client/src/*.js',
             'manager/src/*.js', '!client/src/lib/*', '!manager/src/lib/*'];
module.exports = function(grunt) {

    'use strict';
    
    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            options: {
                jshintrc:true
            },
            all: filesToBeLinted
        },
        
        clean: {
            // Clean any pre-commit hooks in .git/hooks directory
            hooks: ['.git/hooks/pre-commit']
        },

        // Run shell commands
        shell: {
            hooks: {
                // Copy the project's pre-commit hook into .git/hooks
                command: 'cp git-hooks/pre-commit .git/hooks/pre-commit'
            }
        },

        compress: {
            client: {
                options: {
                    mode: 'zip',
                    archive: 'nw-builds/client.nw'
                },
                files: [{
                    expand: true,
                    cwd: 'client/src/',
                    src: ['**']
                }]
            },
            manager: {
                options: {
                    mode: 'zip',
                    archive: 'nw-builds/manager.nw'
                },
                files: [{
                    expand: true,
                    cwd: 'manager/src/',
                    src: ['**']
                }]
            }
        },

        watch: {
            scripts: {
                files: filesToBeLinted.concat(['client/src/*.html',
                                               'manager/src/*.html',
                                               'manager/src/css/styles.css',
                                               'client/src/css/styles.css']),
                tasks: ['jshint', 'compress'],
                options: {
                    spawn: false,
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Install pre-commit hooks
    grunt.registerTask('hookmeup', ['clean:hooks', 'shell:hooks']);

    //build task
    grunt.registerTask('build', ['compress']);

    grunt.event.on('watch', function(action, filepath) {
        grunt.log.writeln(filepath + ' has ' + action);
    });

};
