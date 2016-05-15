'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observeProperty = observeProperty;

var _aureliaMetadata = require('aurelia-metadata');

var _validationRuleset = require('./validation-ruleset');

var _validationEngine = require('./validation-engine');

var _metadataKey = require('./metadata-key');

var _validationRule = require('./validation-rule');

function observeProperty(target, key, descriptor, targetOrConfig, rule) {
  var targetPrototype = rule instanceof _validationRule.ValidationRule ? Object.getPrototypeOf(target) : target;
  var ruleset = _aureliaMetadata.metadata.getOrCreateOwn(_metadataKey.validationMetadataKey, _validationRuleset.ValidationRuleset, targetPrototype);
  if (rule instanceof _validationRule.ValidationRule) {
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
    _validationEngine.ValidationEngine.ensureValidationReporter(this);

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