import { metadata } from 'aurelia-metadata';
import { ValidationRuleset } from './validation-ruleset';
import { ValidationEngine } from './validation-engine';
import { validationMetadataKey } from './metadata-key';
import { ValidationRule } from './validation-rule';

export function observeProperty(target, key, descriptor, targetOrConfig, rule, ruleset) {
  if (rule instanceof ValidationRule) {
    if (!Reflect.has(target, key)) {
      return;
    }
  } else {
    ruleset = metadata.getOrCreateOwn(validationMetadataKey, ValidationRuleset, target);
    ruleset.addRule(key, rule(targetOrConfig));
  }

  let innerPropertyName = `_${ key }`;

  let existingDescriptor = Object.getOwnPropertyDescriptor(target, key);
  let alreadyIntercepted = existingDescriptor !== undefined && existingDescriptor.get !== undefined && existingDescriptor.get.generatedBy == "au-validation";

  let instanceValue = existingDescriptor !== undefined && existingDescriptor.value !== undefined ? existingDescriptor.value : undefined;
  if (instanceValue === undefined) {
    instanceValue = target[key];
  }

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