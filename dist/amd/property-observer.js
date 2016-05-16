define(['exports', 'aurelia-metadata', './validation-ruleset', './validation-engine', './metadata-key', './validation-rule'], function (exports, _aureliaMetadata, _validationRuleset, _validationEngine, _metadataKey, _validationRule) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.observeProperty = observeProperty;
  function observeProperty(target, key, descriptor, targetOrConfig, rule, ruleset) {
    if (rule instanceof _validationRule.ValidationRule) {
      if (!Reflect.has(target, key)) {
        return;
      }
    } else {
      ruleset = _aureliaMetadata.metadata.getOrCreateOwn(_metadataKey.validationMetadataKey, _validationRuleset.ValidationRuleset, target);
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
      _validationEngine.ValidationEngine.ensureValidationReporter(this);

      this[innerPropertyName] = newValue;

      _validationRuleset.ValidationRuleset.prototype.validate.call(ruleset, this);
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
});