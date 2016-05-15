import {metadata} from 'aurelia-metadata';
import {ValidationRuleset} from './validation-ruleset';
import {ValidationEngine} from './validation-engine';
import {validationMetadataKey} from './metadata-key';
import {observeProperty} from './property-observer';
import {ValidatorLite} from './validator-lite'

//instance based validator.
//tied to an instance of an object, will automatically start observing properties included for validation.
//constructor will automatically import any rules defined via decorators.
export class Validator extends ValidatorLite {
  constructor(targetObject) {
    super(targetObject);
    let prototypeRuleset = ValidationRuleset.getDecoratorsRuleset(targetObject);
    if (prototypeRuleset) {
      this.importRuleset(prototypeRuleset);
    }
  }
  
  addRule(key, rule) {
    super.addRule(key, rule);
    observeProperty(this.targetObject, key, undefined, null, rule, this)
  }
  
  static for(object) {
      return new Validator(object);
  }
  
  validate(property) {
    ValidationEngine.ensureValidationReporter(this.targetObject);
    return super.validate(property);
  }
}