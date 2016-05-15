import {Validator, ValidatorLite, ValidationRuleset, ValidationEngine, length, required, date, datetime, email, equality, url, numericality} from 'aurelia-validatejs';

export class Fluent {
  model;
  constructor() {
    this.model = new Model();
    this.validator = new Validator(this.model);
    let ruleSet = new ValidationRuleset()
    .ensure('firstName')
        .required()
        .length({minimum: 3, maximum: 10})
      .ensure('lastName')
        .required()
      .ensure('email')
        .email()
      .ensure('password')
        .length({ minimum: 5, maximum: 25 })
      .ensure('confirmPassword')
        .equality('password')
      .ensure('blueOrRed')
        .inclusion(['blue', 'red'])
      .ensure('gender')
        .exclusion(['male'])
      .ensure('website')
        .url()
      .ensure('age')
        .numericality({ onlyInteger: true, lessThan: 115, greaterThan: 0 })
      .ensure('zipCode')
        .format(/\d{5}(-\d{4})?/);
    this.validator.importRuleset(ruleSet);
    this.test = new Model();
    this.reporter = this.validator.getValidationReporter();
    this.observer = this.reporter.subscribe(result => {
      console.log(result);
    });
  }
  
  addValidatorLite() {
    if (this.secondModel) return;
    this.secondModel = new Model();
    this.validatorLite = new ValidatorLite(this.secondModel)
                        .ensure('gender')
                          .exclusion(['male'])
                        .ensure('blueOrRed')
                          .inclusion(['blue', 'red']);
    this.secondModelReporter = ValidationEngine.getOrCreateValidationReporter(this.secondModel);
    this.secondObserver = this.secondModelReporter.subscribe(result => {
      console.log("From validator lite instance:");
      result.forEach(error => {
        console.log(error);
      })
    });
  }
  
  validate() {
    this.validator.validate();
    if (this.validatorLite) {
      this.validatorLite.validate();
    }
  }
  detached() {
    this.observer.dispose();
  }
}

class Model {
  firstName = 'Luke';
  lastName = 'Skywalker';
  // @date lastUpdated = new Date();
  // @datetime lastTimeUpdated = new Date();
  email = 'luke@skywalker.net';
  password = 'equal';
  confirmPassword = 'equal';
  blueOrRed = 'yellow';
  gender = 'male';
  website = 'http://www.google.com';
  age = 25;
  zipCode = '12345';
}
