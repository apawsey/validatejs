import {DOM} from 'aurelia-pal';
import {ValidationError} from 'aurelia-validation';
import {inject} from 'aurelia-dependency-injection';
import {metadata} from 'aurelia-metadata';

export class ValidationConfig {
  __validationRules__ = [];
  addRule(key, rule) {
    this.__validationRules__.push({ key: key, rule: rule });
  }
  validate(instance, reporter, key) {
    let errors = [];
    this.__validationRules__.forEach(rule => {
      if (!key || key === rule.key) {
        let result = rule.rule.validate(instance, rule.key);
        if (result) {
          errors.push(result);
        }
      }
    });
    reporter.publish(errors);
    return errors;
  }
  getValidationRules() {
    return this.__validationRules__ || (this.__validationRules__ = aggregateValidationRules(this));
  }
  aggregateValidationRules() {
    console.error('not yet implemented');
    //get __validationRules__ from class using metadata
    //merge with any instance specific __validationRules__
  }
}

export const validationMetadataKey = 'aurelia:validation';

export class ValidationRenderer {
  renderErrors(node, relevantErrors) {
    if (relevantErrors.length) {
      this.unrenderErrors(node);
      node.parentElement.classList.add('has-error');
      relevantErrors.forEach(error => {
        if (node.parentElement.textContent.indexOf(error.message) === -1) {
          let errorMessageHelper = DOM.createElement('span');
          let errorMessageNode = DOM.createTextNode(error.message);
          errorMessageHelper.appendChild(errorMessageNode);
          errorMessageHelper.classList.add('help-block', 'au-validation');
          node.parentElement.appendChild(errorMessageHelper);
        }
      });
    } else {
      if (node.parentElement.classList.contains('has-error')) {
        this.unrenderErrors(node);
      }
    }
  }
  unrenderErrors(node) {
    let deleteThese = [];
    node.parentElement.classList.remove('has-error');
    let children = node.parentElement.children;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child.classList.contains('help-block') && child.classList.contains('au-validation')) {
        deleteThese.push(child);
      }
    }
    deleteThese.forEach(child => {
      node.parentElement.removeChild(child);
    });
  }
}

function getRandomId() {
  let rand = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  let id = new Date().getTime() + rand;
  return id;
}

export class ValidationObserver {
  id = getRandomId();
  callback;
  reporter;
  constructor(reporter, callback) {
    this.reporter = reporter;
    this.callback = callback;
  }
  dispose() {
    this.reporter.destroyObserver(this);
  }
}

export class ValidationReporter {
  callback;
  __callbacks__ = {};
  subscribe(callback) {
    let observer = new ValidationObserver(this, callback);
    this.__callbacks__[observer.id] = observer;
    return observer;
  }
  publish(errors, pushRendering) {
    for (let key of Object.keys(this.__callbacks__)) {
      let observer = this.__callbacks__[key];
      observer.callback(errors, pushRendering);
    }
  }
  destroyObserver(observer) {
    delete this.__callbacks__[observer.id];
    return true;
  }
}

import validate from 'validate.js';
export class ValidationRule {
  name = '';
  config;
  constructor(name, config) {
    this.name = name;
    this.config = config;
  }
  validate(target, propName) {
    if (target && propName) {
      let validator = { [propName]: { [this.name]: this.config } };
      let result = validate(target, validator);
      if (result) {
        let error = cleanResult(result);
        result = new ValidationError(error);
      }
      return result;
    }
    throw new Error('Invalid target or property name.');
  }
  static date(config = true) {
    return new ValidationRule('date', config);
  }
  static datetime(config = true) {
    return new ValidationRule('datetime', config);
  }
  static email(config = true) {
    return new ValidationRule('email', config);
  }
  static equality(config) {
    return new ValidationRule('equality', config);
  }
  static exclusion(config) {
    return new ValidationRule('exclusion', config);
  }
  //ensures regex can be cloned by JSON/JSON approach.
  static format(config) {
    if (config instanceof RegExp) {
      let pattern = config.toString();
      pattern = pattern.substr(1, pattern.length - 2);
      config = {
        pattern: pattern
      }
    }
      
    return new ValidationRule('format', config);
  }
  static inclusion(config) {
    return new ValidationRule('inclusion', config);
  }
  static lengthRule(config) {
    return new ValidationRule('length', config);
  }
  static numericality(config = true) {
    return new ValidationRule('numericality', config);
  }
  static presence(config = true) {
    return new ValidationRule('presence', config);
  }
  static url(config = true) {
    return new ValidationRule('url', config);
  }
  
  static custom(config = true, name) {
    if (Reflect.has(config, "name")) {
      return new ValidationRule(config.name, config.config);
    } else {
      return new ValidationRule(name, config);
    }
  }
}

export function cleanResult(data) {
  let result = {};
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      result = {
        propertyName: prop,
        message: data[prop][0]
      };
    }
  }
  return result;
}

@inject(ValidationRenderer)
export class ValidateBindingBehavior {
  constructor(renderer) {
    this.renderer = renderer;
  }
  bind(binding, source) {
    let targetProperty;
    // let target;
    let reporter;
    targetProperty = this.getTargetProperty(binding);
    // target = this.getPropertyContext(source, targetProperty);
    reporter = this.getReporter(source);
    // reporter = ValidationEngine.getValidationReporter(target);
    reporter.subscribe(errors => {
      let relevantErrors = errors.filter(error => {
        return error.propertyName === targetProperty;
      });
      this.renderer.renderErrors(binding.target, relevantErrors);
    });
  }
  unbind(binding, source) {
    // let targetProperty = this.getTargetProperty(source);
    // let target = this.getPropertyContext(source, targetProperty);
    // let reporter = this.getReporter(source);
  }
  getTargetProperty(binding) {
    let targetProperty;
    if (binding.sourceExpression && binding.sourceExpression.expression && binding.sourceExpression.expression.name) {
      targetProperty = binding.sourceExpression.expression.name;
    }
    return targetProperty;
  }
  getPropertyContext(source, targetProperty) {
    let target = getContextFor(source, targetProperty);
    return target;
  }
  getReporter(source) {
    let reporter;
    if (source.bindingContext.reporter) {
      reporter = source.bindingContext.reporter;
    } else {
      let parentContext = source.overrideContext.parentOverrideContext;
      reporter = parentContext.bindingContext.reporter;
    }
    return reporter;
  }
}

export class ValidationEngine {
  static getValidationReporter(instance) {
    return instance.__validationReporter__
  }
  
  static ensureValidationReporter(instance) {
    if (!instance.__validationReporter__)
      instance.__validationReporter__ = new ValidationReporter();
  }
  
  static getOrCreateValidationReporter(instance) {
    ValidationEngine.ensureValidationReporter(instance);
    return ValidationEngine.getValidationReporter(instance);
  }
}

@inject(ValidationRenderer)
export class LiveValidationRenderingBindingBehavior {
  constructor(renderer) {
    this.renderer = renderer;
    this.liveBinding = true;
  }
  
  bind(binding, source) {
    let targetProperty;
    let target;
    let reporter;
    //capture the focus event on the element, so we know if we should start rendering validation errors.
    binding.target._dirty = false;
    binding.target.addEventListener('focus', (event) => { binding.target._dirty = true; });
    targetProperty = this.getTargetProperty(binding);
    target = this.getTargetObject(binding);
    reporter = ValidationEngine.getOrCreateValidationReporter(target);
    reporter.subscribe((errors, pushRendering) => {
      let relevantErrors = errors.filter(error => {
        return error.propertyName === targetProperty;
      });
      //only render errors if they have been pushed by a method call, or the user has touched the field.
      if ((this.liveBinding && binding.target._dirty) || pushRendering)
        this.renderer.renderErrors(binding.target, relevantErrors);
    });
  }
  
  unbind(binding, source) {
    // let targetProperty = this.getTargetProperty(source);
    // let target = this.getPropertyContext(source, targetProperty);
    // let reporter = this.getReporter(source);
  }
  
  getTargetProperty(binding) {
    let targetProperty;
    if (binding.sourceExpression && binding.sourceExpression.expression && binding.sourceExpression.expression.name) {
      targetProperty = binding.sourceExpression.expression.name;
    }
    return targetProperty;
  }
  getTargetObject(binding) {
    let targetObject;
    if (binding.sourceExpression && binding.sourceExpression.expression && binding.sourceExpression.expression.object) {
      targetObject = binding.source.bindingContext[binding.sourceExpression.expression.object.name];
    }  else {
      targetObject = binding.source.bindingContext;
    }
    return targetObject;
  }
  getPropertyContext(source, targetProperty) {
    let target = getContextFor(source, targetProperty);
    return target;
  }
}
// See comments on live validation behavior.  Only difference is this will never live render validations
// want to inherit classes, but not possible within framework, and I don't know how to do a mixin :)
@inject(ValidationRenderer)
export class ValidationRenderingBindingBehavior {
  constructor(renderer) {
    this.renderer = renderer;
    this.liveBinding = false;
  }
  
  bind(binding, source) {
    let targetProperty;
    let target;
    let reporter;
    source._dirty = false;
    binding.target.addEventListener('focus', (event) => { source._dirty = true; });
    targetProperty = this.getTargetProperty(binding);
    target = this.getTargetObject(binding);
    reporter = ValidationEngine.getOrCreateValidationReporter(target);
    reporter.subscribe((errors, pushRendering) => {
      let relevantErrors = errors.filter(error => {
        return error.propertyName === targetProperty;
      });
      if ((this.liveBinding && source._dirty) || pushRendering)
        this.renderer.renderErrors(binding.target, relevantErrors);
    });
  }
   
  unbind(binding, source) {
    // let targetProperty = this.getTargetProperty(source);
    // let target = this.getPropertyContext(source, targetProperty);
    // let reporter = this.getReporter(source);
  }
  
  getTargetProperty(binding) {
    let targetProperty;
    if (binding.sourceExpression && binding.sourceExpression.expression && binding.sourceExpression.expression.name) {
      targetProperty = binding.sourceExpression.expression.name;
    }
    return targetProperty;
  }
  getTargetObject(binding) {
    let targetObject;
    if (binding.sourceExpression && binding.sourceExpression.expression && binding.sourceExpression.expression.object) {
      targetObject = binding.source.bindingContext[binding.sourceExpression.expression.object.name];
    }  else {
      targetObject = binding.source.bindingContext;
    }
    return targetObject;
  }
  getPropertyContext(source, targetProperty) {
    let target = getContextFor(source, targetProperty);
    return target;
  }
}
//Seperate validation rulset
//Can be used independently to build a list of rules, and to validate any object
export class ValidationRuleset
{
  static for(object) {
    return new Validator(object);
  }
  
  __validationRules__ = [];
  
  addRule(key, rule) {
    this.__validationRules__.push({ key: key, rule: rule });
  }
  
  validate(instance, property, _pushRendering) {
    let errors = [];
    //Only gets reporter if one already exists.
    let reporter = ValidationEngine.getValidationReporter(instance);
    this.__validationRules__.forEach(rule => {
      if (!property || property === rule.key) {
        let result = rule.rule.validate(instance, rule.key);
        if (result) {
          errors.push(result);
        }
      }
    });
    //only publishes errors if it finds an existing reporter.  Always returns errors though.
    if (reporter)
      reporter.publish(errors, _pushRendering);
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
}
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

//light weight instance validator.
//does not import prototype rules, does not observeproperties.
//only method for validation is calling validate method.
//Will report via ValidationReporter if getValidationReporter() has previously been called.
export class ValidatorLite extends ValidationRuleset {
    
  constructor(targetObject) {
    super();
    this.targetObject = targetObject;
  }
  
  addRule(key, rule) {
    super.addRule(key,rule);
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
    return ValidationEngine.getOrCreateValidationReporter(this.targetObject)
  }
}
export function base(targetOrConfig, key, descriptor, rule) {
  if (key) {
    let target = targetOrConfig;
    targetOrConfig = null;
    return observeProperty(target, key, descriptor, targetOrConfig, rule);
  }
  return function(t, k, d) {
    return observeProperty(t, k, d, targetOrConfig, rule);
  };
}

//import {ValidatorLite} from './validator-lite'

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
export function length(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.lengthRule);
}

export function presence(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.presence);
}

export function required(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.presence);
}

export function date(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.date);
}

export function datetime(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.datetime);
}

export function email(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.email);
}

export function equality(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.equality);
}

export function exclusion(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.exclusion);
}

export function inclusion(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.inclusion);
}

export function format(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.format);
}

export function url(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.url);
}

export function numericality(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, ValidationRule.numericality);
}

export function custom(name, targetOrConfig, key, descriptor) {
  targetOrConfig = {
    name: name,
    config: targetOrConfig === undefined ? true : targetOrConfig
  }
  return base(targetOrConfig, key, descriptor, ValidationRule.custom);
}
