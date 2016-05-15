'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationRuleset = undefined;

var _validationRule = require('./validation-rule');

var _validationEngine = require('./validation-engine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationRuleset = exports.ValidationRuleset = function () {
  function ValidationRuleset() {
    _classCallCheck(this, ValidationRuleset);

    this.__validationRules__ = [];
  }

  ValidationRuleset.for = function _for(object) {
    return new Validator(object);
  };

  ValidationRuleset.prototype.addRule = function addRule(key, rule) {
    this.__validationRules__.push({ key: key, rule: rule });
  };

  ValidationRuleset.prototype.validate = function validate(instance, property, _pushRendering) {
    var errors = [];

    var reporter = _validationEngine.ValidationEngine.getValidationReporter(instance);
    this.__validationRules__.forEach(function (rule) {
      if (!property || property === rule.key) {
        var result = rule.rule.validate(instance, rule.key);
        if (result) {
          errors.push(result);
        }
      }
    });
    if (reporter) reporter.publish(errors, _pushRendering);
    return errors;
  };

  ValidationRuleset.prototype[Symbol.iterator] = function () {
    return this.__validationRules__[Symbol.iterator];
  };

  ValidationRuleset.prototype.getValidationRules = function getValidationRules() {
    return this.__validationRules__ || (this.__validationRules__ = aggregateValidationRules(this));
  };

  ValidationRuleset.prototype.aggregateValidationRules = function aggregateValidationRules() {
    console.error('not yet implemented');
  };

  ValidationRuleset.prototype.ensure = function ensure(property) {
    this.currentProperty = property;
    return this;
  };

  ValidationRuleset.prototype.length = function length(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.lengthRule(configuration));
    return this;
  };

  ValidationRuleset.prototype.presence = function presence(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.presence(configuration));
    return this;
  };

  ValidationRuleset.prototype.required = function required(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.presence(configuration));
    return this;
  };

  ValidationRuleset.prototype.numericality = function numericality(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.numericality(configuration));
    return this;
  };

  ValidationRuleset.prototype.date = function date(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.date(configuration));
    return this;
  };

  ValidationRuleset.prototype.datetime = function datetime(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.datetime(configuration));
    return this;
  };

  ValidationRuleset.prototype.email = function email(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.email(configuration));
    return this;
  };

  ValidationRuleset.prototype.equality = function equality(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.equality(configuration));
    return this;
  };

  ValidationRuleset.prototype.format = function format(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.format(configuration));
    return this;
  };

  ValidationRuleset.prototype.inclusion = function inclusion(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.inclusion(configuration));
    return this;
  };

  ValidationRuleset.prototype.exclusion = function exclusion(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.exclusion(configuration));
    return this;
  };

  ValidationRuleset.prototype.url = function url(configuration) {
    this.addRule(this.currentProperty, _validationRule.ValidationRule.url(configuration));
    return this;
  };

  return ValidationRuleset;
}();