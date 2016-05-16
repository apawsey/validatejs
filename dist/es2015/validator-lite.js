import { ValidationRuleset } from './validation-ruleset';
import { ValidationRule } from './validation-rule';
import { ValidationEngine } from './validation-engine';

export let ValidatorLite = class ValidatorLite extends ValidationRuleset {

  constructor(targetObject) {
    super();
    this.targetObject = targetObject;
  }

  addRule(key, rule) {
    super.addRule(key, rule);
  }

  importRuleset(ruleset) {
    for (var rule of ruleset) {
      this.addRule(rule.key, new ValidationRule(rule.rule.name, JSON.parse(JSON.stringify(rule.rule.config))));
    }
  }

  getProperties() {
    console.error('Not yet implemented');
  }

  static for(object) {
    return new ValidatorLite(object);
  }

  validate(property) {
    if (property) {
      return super.validate(this.targetObject, property, true);
    } else {
      return super.validate(this.targetObject, null, true);
    }
  }

  getValidationReporter() {
    return ValidationEngine.getOrCreateValidationReporter(this.targetObject);
  }
};