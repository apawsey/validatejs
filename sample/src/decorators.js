import {inject} from 'aurelia-framework';
import {length, required, date, datetime, email, equality, exclusion, inclusion, format, url, numericality, custom} from 'aurelia-validatejs';
import {ValidationEngine} from 'aurelia-validatejs';
import {Validator} from 'aurelia-validatejs';
import validate from 'validate.js';

validate.validators.strongPassword = function(value, options, key, attributes) {
    let threshold = 3;
    if (options.hasOwnProperty("minimumComplexityLevel")) {
        threshold = options.minimumComplexityLevel;
    }
    let errorMessage = "should contain " + (threshold < 4 ? "at least " + threshold + " of the following groups:" : "a combination of") + " lowercase letters, uppercase letters, digits or special characters"
    if (typeof (value) !== 'string') {
        return false;
    }
    let strength = 0;
    strength += /[A-Z]+/.test(value) ? 1 : 0;
    strength += /[a-z]+/.test(value) ? 1 : 0;
    strength += /[0-9]+/.test(value) ? 1 : 0;
    strength += /[\W]+/.test(value) ? 1 : 0;

    return strength >= threshold ? null : errorMessage;
}

export class Decorators {
  model;
  errors = [];
  subscriber;
  validator;
  constructor() {
    this.model = new Model();
    
    this.reporter = ValidationEngine.getOrCreateValidationReporter(this.model);
    this.subscriber = this.reporter.subscribe(result => {
      console.log("received errors from reporter!")
      this.renderErrors(result);
    });
  }
  
  detached() {
    this.subscriber.dispose();
  }
  
  addValidator() {
    if (this.validator) return;
    this.detached();
    this.validator = new Validator(this.model);
    this.validator.ensure("lastName")
                    .exclusion({
                      within: ["Skywalker"],
                      message: "^No way, you're not fooling anyone!"
                    });
  }
  
  submit() {
    if (this.validator) {
      this.errors = this.validator.validate();
    }
    if (!this.hasErrors()) {
      alert('Submitted successfully');
    } else {
      alert('Form has errors');
    }
  }
  hasErrors() {
    return !!this.errors.length;
  }
  renderErrors(result) {
    this.errors.splice(0, this.errors.length);
    result.forEach(error => {
      this.errors.push(error)
    });
  }
}

class Model {
  @length({ minimum: 5, maximum: 25 }) firstName = 'Luke';
  @required lastName = 'Skywalker';
  // @date lastUpdated = new Date();
  // @datetime lastTimeUpdated = new Date();
  @email email = 'luke@skywalker.net';
  @custom('strongPassword') @length({ minimum: 5, maximum: 25 }) password = 'equal';
  @equality('password') confirmPassword = 'equal';
  @inclusion(['blue', 'red']) blueOrRed = 'yellow';
  @exclusion(['male']) gender = 'male';
  @url website = 'http://www.google.com';
  @numericality({ onlyInteger: true, lessThan: 115, greaterThan: 0 }) age = 25;
  @format(/\d{5}(-\d{4})?/) zipCode = '12345';
}
