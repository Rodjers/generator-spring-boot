'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the awesome ' + chalk.red('Spring Boot') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'packageName',
      message: 'Enter package name:',
      default: 'com.example.spring.exampleapp'
    },
    {
      type: 'input',
      name: 'mainClassName',
      message: 'Enter main class name:',
      default: 'ExampleApplication'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: function () {

    var testDirPrefix = 'src/test/java/';
    var srcDirPrefix = 'src/main/java/';
    var testDir = testDirPrefix + this.props.packageName.replace('.','/');
    var srcDir = srcDirPrefix + this.props.packageName.replace('.','/');
    var resourceDir = 'src/main/resources/';
    var gradleWrapperDir = 'gradle/wrapper/';

    this.fs.copyTpl(
      this.templatePath('build.gradle'),
      this.destinationPath('build.gradle'),
      this.props
    );
    this.fs.copy(
      this.templatePath('gradlew'),
      this.destinationPath('gradlew')
    );
    this.fs.copy(
      this.templatePath('gradlew.bat'),
      this.destinationPath('gradlew.bat')
    );
    this.fs.copy(
      this.templatePath(gradleWrapperDir + 'gradle-wrapper.jar'),
      this.destinationPath(gradleWrapperDir + 'gradle-wrapper.jar')
    );
    this.fs.copy(
      this.templatePath(gradleWrapperDir + 'gradle-wrapper.properties'),
      this.destinationPath(gradleWrapperDir + 'gradle-wrapper.properties')
    );
    this.fs.copyTpl(
      this.templatePath(testDirPrefix + 'SpringTemplateApplicationTests.java'),
      this.destinationPath(testDir + '/' + this.props.mainClassName + 'Tests.java'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(srcDirPrefix + 'SpringTemplateApplication.java'),
      this.destinationPath(srcDir + '/' + this.props.mainClassName + '.java'),
      this.props
    );
    this.fs.copy(
      this.templatePath(resourceDir + 'application.properties'),
      this.destinationPath(resourceDir + 'application.properties')
    );
    this.fs.copy(
      this.templatePath(resourceDir + 'logback.xml'),
      this.destinationPath(resourceDir + 'logback.xml')
    );
  },

  install: function () {
  }
});
