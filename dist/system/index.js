'use strict';

System.register(['./decorators', './validation-engine', 'aurelia-validation', './validator', './validator-lite', './validation-ruleset', './validation-reporter', './validation-renderer'], function (_export, _context) {
  var Validator, ValidateJSValidator, ValidationReporter, ValidateJSReporter;
  return {
    setters: [function (_decorators) {
      var _exportObj = {};
      _exportObj.length = _decorators.length;
      _exportObj.required = _decorators.required;
      _exportObj.date = _decorators.date;
      _exportObj.datetime = _decorators.datetime;
      _exportObj.email = _decorators.email;
      _exportObj.equality = _decorators.equality;
      _exportObj.exclusion = _decorators.exclusion;
      _exportObj.inclusion = _decorators.inclusion;
      _exportObj.format = _decorators.format;
      _exportObj.url = _decorators.url;
      _exportObj.numericality = _decorators.numericality;
      _exportObj.custom = _decorators.custom;

      _export(_exportObj);
    }, function (_validationEngine) {
      var _exportObj2 = {};
      _exportObj2.ValidationEngine = _validationEngine.ValidationEngine;

      _export(_exportObj2);
    }, function (_aureliaValidation) {
      Validator = _aureliaValidation.Validator;
      ValidationReporter = _aureliaValidation.ValidationReporter;
    }, function (_validator) {
      ValidateJSValidator = _validator.Validator;
      var _exportObj3 = {};
      _exportObj3.Validator = _validator.Validator;

      _export(_exportObj3);
    }, function (_validatorLite) {
      var _exportObj4 = {};
      _exportObj4.ValidatorLite = _validatorLite.ValidatorLite;

      _export(_exportObj4);
    }, function (_validationRuleset) {
      var _exportObj5 = {};
      _exportObj5.ValidationRuleset = _validationRuleset.ValidationRuleset;

      _export(_exportObj5);
    }, function (_validationReporter) {
      ValidateJSReporter = _validationReporter.ValidationReporter;
      var _exportObj6 = {};
      _exportObj6.ValidationReporter = _validationReporter.ValidationReporter;

      _export(_exportObj6);
    }, function (_validationRenderer) {
      var _exportObj7 = {};
      _exportObj7.ValidationRenderer = _validationRenderer.ValidationRenderer;

      _export(_exportObj7);
    }],
    execute: function () {
      function configure(config) {
        config.container.registerHandler(Validator, ValidateJSValidator);
        config.container.registerHandler(ValidationReporter, ValidateJSReporter);
        config.globalResources('./validation-rendering-binding-behavior');
        config.globalResources('./live-validation-rendering-binding-behavior');
      }

      _export('configure', configure);
    }
  };
});