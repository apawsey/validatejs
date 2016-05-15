declare module 'aurelia-validatejs' {
  import {
    DOM
  } from 'aurelia-pal';
  import {
    ValidationError
  } from 'aurelia-validation';
  import {
    inject
  } from 'aurelia-dependency-injection';
  import {
    metadata
  } from 'aurelia-metadata';
  import validate from 'validate.js';
  export const validationMetadataKey: any;
  export class ValidationRenderer {
    renderErrors(node: any, relevantErrors: any): any;
    clearErrors(node: any): any;
  }
  export class ValidationObserver {
    id: any;
    callback: any;
    reporter: any;
    constructor(reporter: any, callback: any);
    dispose(): any;
  }
  export class ValidationReporter {
    callback: any;
    __callbacks__: any;
    subscribe(callback: any): any;
    publish(errors: any, pushRendering: any): any;
    destroyObserver(observer: any): any;
  }
  export class ValidationRule {
    name: any;
    config: any;
    constructor(name: any, config: any);
    validate(target: any, propName: any): any;
    static date(config?: any): any;
    static datetime(config?: any): any;
    static email(config?: any): any;
    static equality(config: any): any;
    static exclusion(config: any): any;
    static format(config: any): any;
    static inclusion(config: any): any;
    static lengthRule(config: any): any;
    static numericality(config?: any): any;
    static presence(config?: any): any;
    static url(config?: any): any;
  }
  export function cleanResult(data: any): any;
  export class ValidationEngine {
    static getValidationReporter(instance: any): any;
    static ensureValidationReporter(instance: any): any;
    static getOrCreateValidationReporter(instance: any): any;
  }
  export class LiveValidationRenderingBindingBehavior {
    constructor(renderer: any);
    
    // handleEvent(event) {
    //   if (event.type !== 'blur') {
    //     return;
    //   }
    // };
    bind(binding: any, source: any): any;
    
    // _onTargetElementBlur(event) {
    //     source._dirty = true;
    //     event.target.removeEventListener('blur', this._onTargetElementBlur);  
    // }
    unbind(binding: any, source: any): any;
    
    // let targetProperty = this.getTargetProperty(source);
    // let target = this.getPropertyContext(source, targetProperty);
    // let reporter = this.getReporter(source);
    getTargetProperty(binding: any): any;
    getTargetObject(binding: any): any;
    getPropertyContext(source: any, targetProperty: any): any;
  }
  
  // getReporter(source) {
  //   if (source.bindingContext.reporter) {
  //     reporter = source.bindingContext.reporter;
  //   } else {
  //     let parentContext = source.overrideContext.parentOverrideContext;
  //     reporter = parentContext.bindingContext.reporter;
  //   }
  //   return reporter;
  // }
  export class ValidationRenderingBindingBehavior {
    constructor(renderer: any);
    
    // handleEvent(event) {
    //   if (event.type !== 'blur') {
    //     return;
    //   }
    // };
    bind(binding: any, source: any): any;
    
    // _onTargetElementBlur(event) {
    //     source._dirty = true;
    //     event.target.removeEventListener('blur', this._onTargetElementBlur);  
    // }
    unbind(binding: any, source: any): any;
    
    // let targetProperty = this.getTargetProperty(source);
    // let target = this.getPropertyContext(source, targetProperty);
    // let reporter = this.getReporter(source);
    getTargetProperty(binding: any): any;
    getTargetObject(binding: any): any;
    getPropertyContext(source: any, targetProperty: any): any;
  }
  
  // getReporter(source) {
  //   if (source.bindingContext.reporter) {
  //     reporter = source.bindingContext.reporter;
  //   } else {
  //     let parentContext = source.overrideContext.parentOverrideContext;
  //     reporter = parentContext.bindingContext.reporter;
  //   }
  //   return reporter;
  // }
  //Seperate validation rulset
  //Can be used independently to validate any object
  export class ValidationRuleset {
    static for(object: any): any;
    __validationRules__: any;
    addRule(key: any, rule: any): any;
    validate(instance: any, property: any, _pushRendering: any): any;
    getValidationRules(): any;
    aggregateValidationRules(): any;
    
    //get __validationRules__ from class using metadata
    //merge with any instance specific __validationRules__
    ensure(property: any): any;
    length(configuration: any): any;
    presence(configuration: any): any;
    required(configuration: any): any;
    numericality(configuration: any): any;
    date(configuration: any): any;
    datetime(configuration: any): any;
    email(configuration: any): any;
    equality(configuration: any): any;
    format(configuration: any): any;
    inclusion(configuration: any): any;
    exclusion(configuration: any): any;
    url(configuration: any): any;
  }
  export function observeProperty(target: any, key: any, descriptor: any, targetOrConfig: any, rule: any): any;
  export class ValidatorLite extends ValidationRuleset {
    constructor(targetObject: any);
    addRule(key: any, rule: any): any;
    importRuleset(ruleset: any): any;
    getProperties(): any;
    static for(object: any): any;
    validate(property: any): any;
    getValidationReporter(): any;
  }
  export function base(targetOrConfig: any, key: any, descriptor: any, rule: any): any;
  
  //import {ValidatorLite} from './validatorlite'
  export class Validator extends ValidatorLite {
    constructor(targetObject: any);
    addRule(key: any, rule: any): any;
    static for(object: any): any;
    validate(property: any): any;
  }
  export function length(targetOrConfig: any, key: any, descriptor: any): any;
  export function presence(targetOrConfig: any, key: any, descriptor: any): any;
  export function required(targetOrConfig: any, key: any, descriptor: any): any;
  export function date(targetOrConfig: any, key: any, descriptor: any): any;
  export function datetime(targetOrConfig: any, key: any, descriptor: any): any;
  export function email(targetOrConfig: any, key: any, descriptor: any): any;
  export function equality(targetOrConfig: any, key: any, descriptor: any): any;
  export function exclusion(targetOrConfig: any, key: any, descriptor: any): any;
  export function inclusion(targetOrConfig: any, key: any, descriptor: any): any;
  export function format(targetOrConfig: any, key: any, descriptor: any): any;
  export function url(targetOrConfig: any, key: any, descriptor: any): any;
  export function numericality(targetOrConfig: any, key: any, descriptor: any): any;
}