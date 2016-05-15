import { metadata } from 'aurelia-metadata';
import { ValidationRuleset } from './validation-ruleset';
import { ValidationEngine } from './validation-engine';
import { validationMetadataKey } from './metadata-key';
import { observeProperty } from './property-observer';


export let Validator = class Validator extends ValidatorLite {
  constructor(targetObject) {
    super(targetObject);
    let ruleset = metadata.getOrCreateOwn(validationMetadataKey, ValidationRuleset, Object.getPrototypeOf(this.targetObject));
    this.ruleset = ruleset;
  }

  addRule(key, rule) {
    observeProperty(this.targetObject, key, undefined, null, rule);
  }

  static for(object) {
    return new Validator(object);
  }

  validate(property) {
    ValidationEngine.ensureValidationReporter(this.targetObject);
    return super.validate(property);
  }
};