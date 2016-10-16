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
    },
    {
      type: 'confirm',
      name: 'metricsEnabled',
      message: 'Do you want the app to expose a metrics endpoint?',
      default: 'true'
    },
    {
      type: 'confirm',
      name: 'prometheusEnabled',
      message: 'Do you want the app to expose metrics in the prometheus format?',
      default: 'true'
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
    var testDir = testDirPrefix + this.props.packageName.replace(/\./g,'/') + '/';
    var srcDir = srcDirPrefix + this.props.packageName.replace(/\./g,'/') + '/';
    var metricsDir = srcDir + 'metrics/'
    var metricsDirPrefix = srcDirPrefix + 'metrics/'
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
      this.destinationPath(testDir + this.props.mainClassName + 'Tests.java'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(srcDirPrefix + 'SpringTemplateApplication.java'),
      this.destinationPath(srcDir + this.props.mainClassName + '.java'),
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
    if (this.props.prometheusEnabled) {
      this.fs.copyTpl(
        this.templatePath( metricsDirPrefix + 'PrometheusEndpoint.java'),
        this.destinationPath(metricsDir + 'PrometheusEndpoint.java'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath( metricsDirPrefix + 'PrometheusEndpointContextConfiguration.java'),
        this.destinationPath(metricsDir + 'PrometheusEndpointContextConfiguration.java'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath( metricsDirPrefix + 'PrometheusMetricWriter.java'),
        this.destinationPath(metricsDir + 'PrometheusMetricWriter.java'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath( metricsDirPrefix + 'PrometheusMvcEndpoint.java'),
        this.destinationPath(metricsDir + 'PrometheusMvcEndpoint.java'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath( resourceDir + 'META-INF/spring.factories'),
        this.destinationPath(metricsDir + 'META-INF/spring.factories'),
        this.props
      );
    }
  },

  install: function () {
  }
});
