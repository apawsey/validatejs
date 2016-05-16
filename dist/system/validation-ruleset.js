'use strict';

System.register(['./validation-rule', './validation-engine', 'aurelia-metadata', './metadata-key'], function (_export, _context) {
  var ValidationRule, ValidationEngine, metadata, validationMetadataKey, ValidationRuleset;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_validationRule) {
      ValidationRule = _validationRule.ValidationRule;
    }, function (_validationEngine) {
      ValidationEngine = _validationEngine.ValidationEngine;
    }, function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }, function (_metadataKey) {
      validationMetadataKey = _metadataKey.validationMetadataKey;
    }],
    execute: function () {
      _export('ValidationRuleset', ValidationRuleset = function () {
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

          var reporter = ValidationEngine.getValidationReporter(instance);
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
          return this.__validationRules__[Symbol.iterator]();
        };

        ValidationRuleset.getDecoratorsRuleset = function getDecoratorsRuleset(instance) {
          var prototypeRuleset = metadata.get(validationMetadataKey, instance);
          if (prototypeRuleset) {
            return prototypeRuleset;
          } else {
            return undefined;
          }
        };

        ValidationRuleset.prototype.ensure = function ensure(property) {
          this.currentProperty = property;
          return this;
        };

        ValidationRuleset.prototype.length = function length(configuration) {
          this.addRule(this.currentProperty, ValidationRule.lengthRule(configuration));
          return this;
        };

        ValidationRuleset.prototype.presence = function presence(configuration) {
          this.addRule(this.currentProperty, ValidationRule.presence(configuration));
          return this;
        };

        ValidationRuleset.prototype.required = function required(configuration) {
          this.addRule(this.currentProperty, ValidationRule.presence(configuration));
          return this;
        };

        ValidationRuleset.prototype.numericality = function numericality(configuration) {
          this.addRule(this.currentProperty, ValidationRule.numericality(configuration));
          return this;
        };

        ValidationRuleset.prototype.date = function date(configuration) {
          this.addRule(this.currentProperty, ValidationRule.date(configuration));
          return this;
        };

        ValidationRuleset.prototype.datetime = function datetime(configuration) {
          this.addRule(this.currentProperty, ValidationRule.datetime(configuration));
          return this;
        };

        ValidationRuleset.prototype.email = function email(configuration) {
          this.addRule(this.currentProperty, ValidationRule.email(configuration));
          return this;
        };

        ValidationRuleset.prototype.equality = function equality(configuration) {
          this.addRule(this.currentProperty, ValidationRule.equality(configuration));
          return this;
        };

        ValidationRuleset.prototype.format = function format(configuration) {
          this.addRule(this.currentProperty, ValidationRule.format(configuration));
          return this;
        };

        ValidationRuleset.prototype.inclusion = function inclusion(configuration) {
          this.addRule(this.currentProperty, ValidationRule.inclusion(configuration));
          return this;
        };

        ValidationRuleset.prototype.exclusion = function exclusion(configuration) {
          this.addRule(this.currentProperty, ValidationRule.exclusion(configuration));
          return this;
        };

        ValidationRuleset.prototype.url = function url(configuration) {
          this.addRule(this.currentProperty, ValidationRule.url(configuration));
          return this;
        };

        return ValidationRuleset;
      }());

      _export('ValidationRuleset', ValidationRuleset);
    }
  };
});