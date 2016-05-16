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
      function observeProperty(target, key, descriptor, targetOrConfig, rule, ruleset) {
        if (rule instanceof ValidationRule) {
          if (!Reflect.has(target, key)) {
            return;
          }
        } else {
          ruleset = metadata.getOrCreateOwn(validationMetadataKey, ValidationRuleset, target);
          ruleset.addRule(key, rule(targetOrConfig));
        }

        var innerPropertyName = '_' + key;

        var existingDescriptor = Object.getOwnPropertyDescriptor(target, key);
        var alreadyIntercepted = existingDescriptor !== undefined && existingDescriptor.get !== undefined && existingDescriptor.get.generatedBy == "au-validation";

        var instanceValue = existingDescriptor !== undefined && existingDescriptor.value !== undefined ? existingDescriptor.value : undefined;
        if (instanceValue === undefined) {
          instanceValue = target[key];
        }

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

          ValidationRuleset.prototype.validate.call(ruleset, this);
        };

        descriptor.get.dependencies = [innerPropertyName];

        descriptor.get.generatedBy = "au-validation";

        if (!babel && !alreadyIntercepted) {
          Reflect.defineProperty(target, key, descriptor);
          if (instanceValue) {
            target[innerPropertyName] = instanceValue;
          }
        }
      }

      _export('observeProperty', observeProperty);
    }
  };
});