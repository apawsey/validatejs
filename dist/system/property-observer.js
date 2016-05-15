'use strict';

System.register(['aurelia-metadata', './validation-ruleset', './validation-engine', './metadata-key', './validation-rule'], function (_export, _context) {
  var metadata, ValidationRuleset, ValidationEngine, validationMetadataKey, ValidationRule;
  return {
    setters: [function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }, function (_validationRuleset) {
      ValidationRuleset = _validationRuleset.ValidationRuleset;
    }, function (_validationEngine) {
      ValidationEngine = _validationEngine.ValidationEngine;
    }, function (_metadataKey) {
      validationMetadataKey = _metadataKey.validationMetadataKey;
    }, function (_validationRule) {
      ValidationRule = _validationRule.ValidationRule;
    }],
    execute: function () {
      function observeProperty(target, key, descriptor, targetOrConfig, rule) {
        var targetPrototype = rule instanceof ValidationRule ? Object.getPrototypeOf(target) : target;
        var ruleset = metadata.getOrCreateOwn(validationMetadataKey, ValidationRuleset, targetPrototype);
        if (rule instanceof ValidationRule) {
          ruleset.addRule(key, rule);
        } else {
          ruleset.addRule(key, rule(targetOrConfig));
          targetPrototype = null;
        }

        var innerPropertyName = '_' + key;

        var babel = descriptor !== undefined;

        if (babel) {
          if (typeof descriptor.initializer === 'function') {
            target[innerPropertyName] = descriptor.initializer();
          }
        } else {
          descriptor = {};
        }

        delete descriptor.writable;
        delete descriptor.initializer;

        descriptor.get = function () {
          return this[innerPropertyName];
        };
        descriptor.set = function (newValue) {
          ValidationEngine.ensureValidationReporter(this);

          this[innerPropertyName] = newValue;

          ruleset.validate(this);
        };

        descriptor.get.dependencies = [innerPropertyName];
        var extistingInstanceDescriptor = Object.getOwnPropertyDescriptor(target, key);
        var alreadyInterceptedInstance = existingDescriptor && existingDescriptor.get && existingDescriptor.get.generatedBy == "au-validation";
        var extistingProtoTypeDescriptor = targetPrototype ? Object.getOwnPropertyDescriptor(targetPrototype, key) : null;
        var alreadyInterceptedPrototype = existingDescriptor && existingDescriptor.get && existingDescriptor.get.generatedBy == "au-validation";
        descriptor.get.generatedBy = "au-validation";

        if (!babel || !alreadyIntercepted) {
          Reflect.defineProperty(target, key, descriptor);
        }

        if (targetPrototype && !alreadyInterceptedPrototype) {
          Reflect.defineProperty(targetPrototype, key, descriptor);
        }
      }

      _export('observeProperty', observeProperty);
    }
  };
});