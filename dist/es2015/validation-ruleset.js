import { ValidationRule } from './validation-rule';
import { ValidationEngine } from './validation-engine';
import { metadata } from 'aurelia-metadata';
import { validationMetadataKey } from './metadata-key';

export let ValidationRuleset = class ValidationRuleset {
  constructor() {
    this.__validationRules__ = [];
  }

  static for(object) {
    return new Validator(object);
  }

  addRule(key, rule) {
    this.__validationRules__.push({ key: key, rule: rule });
  }

  validate(instance, property, _pushRendering) {
    let errors = [];

    let reporter = ValidationEngine.getValidationReporter(instance);
    this.__validationRules__.forEach(rule => {
      if (!property || property === rule.key) {
        let result = rule.rule.validate(instance, rule.key);
        if (result) {
          errors.push(result);
        }
      }
    });

    if (reporter) reporter.publish(errors, _pushRendering);
    return errors;
  }

  [Symbol.iterator]() {
    return this.__validationRules__[Symbol.iterator]();
  }

  static getDecoratorsRuleset(instance) {
    let prototypeRuleset = metadata.get(validationMetadataKey, instance);
    if (prototypeRuleset) {
      return prototypeRuleset;
    } else {
      return undefined;
    }
  }

  ensure(property) {
    this.currentProperty = property;
    return this;
  }
  length(configuration) {
    this.addRule(this.currentProperty, ValidationRule.lengthRule(configuration));
    return this;
  }
  presence(configuration) {
    this.addRule(this.currentProperty, ValidationRule.presence(configuration));
    return this;
  }
  required(configuration) {
    this.addRule(this.currentProperty, ValidationRule.presence(configuration));
    return this;
  }
  numericality(configuration) {
    this.addRule(this.currentProperty, ValidationRule.numericality(configuration));
    return this;
  }
  date(configuration) {
    this.addRule(this.currentProperty, ValidationRule.date(configuration));
    return this;
  }
  datetime(configuration) {
    this.addRule(this.currentProperty, ValidationRule.datetime(configuration));
    return this;
  }
  email(configuration) {
    this.addRule(this.currentProperty, ValidationRule.email(configuration));
    return this;
  }
  equality(configuration) {
    this.addRule(this.currentProperty, ValidationRule.equality(configuration));
    return this;
  }
  format(configuration) {
    this.addRule(this.currentProperty, ValidationRule.format(configuration));
    return this;
  }
  inclusion(configuration) {
    this.addRule(this.currentProperty, ValidationRule.inclusion(configuration));
    return this;
  }
  exclusion(configuration) {
    this.addRule(this.currentProperty, ValidationRule.exclusion(configuration));
    return this;
  }
  url(configuration) {
    this.addRule(this.currentProperty, ValidationRule.url(configuration));
    return this;
  }
};