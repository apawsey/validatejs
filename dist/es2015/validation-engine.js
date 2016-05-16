import { ValidationReporter } from './validation-reporter';

export let ValidationEngine = class ValidationEngine {
  static getValidationReporter(instance) {
    return instance.__validationReporter__;
  }

  static ensureValidationReporter(instance) {
    if (!instance.__validationReporter__) instance.__validationReporter__ = new ValidationReporter();
  }

  static getOrCreateValidationReporter(instance) {
    ValidationEngine.ensureValidationReporter(instance);
    return ValidationEngine.getValidationReporter(instance);
  }
};