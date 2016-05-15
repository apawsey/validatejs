import {metadata} from 'aurelia-metadata';
import {ValidationRuleset} from './validation-ruleset';
import {ValidationEngine} from './validation-engine';
import {validationMetadataKey} from './metadata-key';
import {ValidationRule} from './validation-rule';

export function observeProperty(target, key, descriptor, targetOrConfig, rule, ruleset) {
  // if rule is an existing instance, we know we came from the Validator, rather than the decorators.
  if (rule instanceof ValidationRule) {
    //avoid inserting properties that do not exist. - Possible problem if the property is added later?
    if (!Reflect.has(target, key)) {
      return;
    }
  } else {
    // get ruleset from metatdata
    ruleset = metadata.getOrCreateOwn(validationMetadataKey, ValidationRuleset, target);
    ruleset.addRule(key, rule(targetOrConfig));
  }

  // TODO: REMOVE
  let innerPropertyName = `_${key}`;
  
  //Check if we've already intercepted a specific property
  let existingDescriptor = Object.getOwnPropertyDescriptor(target, key);
  let alreadyIntercepted = ((existingDescriptor !== undefined) && (existingDescriptor.get !== undefined) && existingDescriptor.get.generatedBy == "au-validation")
  //capture any existing value, otherwise it disappears when we redefine the property
  let instanceValue = ((existingDescriptor !== undefined) && (existingDescriptor.value !== undefined) ? existingDescriptor.value : undefined)
  if (instanceValue === undefined) {
    instanceValue = target[key];
  }
  
  // typescript or babel?
  let babel = descriptor !== undefined;

  if (babel) {
    // babel passes in the property descriptor with a method to get the initial value.

    // set the initial value of the property if it is defined.
    if (typeof descriptor.initializer === 'function') {
      target[innerPropertyName] = descriptor.initializer();
    }
  } else {
    descriptor = {};
  }

  delete descriptor.writable;
  delete descriptor.initializer;
  
  descriptor.get = function() { return this[innerPropertyName]; };
  descriptor.set = function(newValue) {
    ValidationEngine.ensureValidationReporter(this);

    this[innerPropertyName] = newValue;

    //ensure we always call the basic ruleset validation method (rather than the validator classes methods)
    ValidationRuleset.prototype.validate.call(ruleset, this);
  };

  descriptor.get.dependencies = [innerPropertyName];
  //tag the descriptor s we know we generated it.
  descriptor.get.generatedBy = "au-validation";
  
  if (!babel && !alreadyIntercepted) {
    Reflect.defineProperty(target, key, descriptor);
    if (instanceValue) {
      target[innerPropertyName] = instanceValue;
    }
  }
}
