import { metadata } from 'aurelia-metadata';
import { ValidationRuleset } from './validation-ruleset';
import { ValidationEngine } from './validation-engine';
import { validationMetadataKey } from './metadata-key';
import { ValidationRule } from './validation-rule';

export function observeProperty(target, key, descriptor, targetOrConfig, rule) {
  let targetPrototype = rule instanceof ValidationRule ? Object.getPrototypeOf(target) : target;
  let ruleset = metadata.getOrCreateOwn(validationMetadataKey, ValidationRuleset, targetPrototype);
  if (rule instanceof ValidationRule) {
    ruleset.addRule(key, rule);
  } else {
    ruleset.addRule(key, rule(targetOrConfig));
    targetPrototype = null;
  }

  let innerPropertyName = `_${ key }`;

  let babel = descriptor !== undefined;

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
  let extistingInstanceDescriptor = Object.getOwnPropertyDescriptor(target, key);
  let alreadyInterceptedInstance = existingDescriptor && existingDescriptor.get && existingDescriptor.get.generatedBy == "au-validation";
  let extistingProtoTypeDescriptor = targetPrototype ? Object.getOwnPropertyDescriptor(targetPrototype, key) : null;
  let alreadyInterceptedPrototype = existingDescriptor && existingDescriptor.get && existingDescriptor.get.generatedBy == "au-validation";
  descriptor.get.generatedBy = "au-validation";

  if (!babel || !alreadyIntercepted) {
    Reflect.defineProperty(target, key, descriptor);
  }

  if (targetPrototype && !alreadyInterceptedPrototype) {
    Reflect.defineProperty(targetPrototype, key, descriptor);
  }
}