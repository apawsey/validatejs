import { ValidationRuleset } from './validation-ruleset';
import { ValidationRule } from './validation-rule';

export let ValidatorLite = class ValidatorLite extends ValidationRuleset {

  constructor(targetObject) {
    super();
    this.targetObject = targetObject;
  }

  addRule(key, rule) {
    super.addRule(key, rule);
  }

  importRuleset(ruleset) {
    ruleset.forEach(rule => {
      this.addRule(rule.key, new ValidationRule(rule.value.name, JSON.parse(JSON.stringify(rule.value.config))));
    });
  }

  getProperties() {
    console.error('Not yet implemented');
  }

  static for(object) {
    return new ValidatorLite(object);
  }

  validate(property) {
    if (property) {
      return this.ruleset.validate(this.targetObject, property, true);
    } else {
      return this.ruleset.validate(this.targetObject, null, true);
    }
  }

  getValidationReporter() {
    return ValidationEngine.getOrCreateValidationReporter(this.targetObject);
  }
};