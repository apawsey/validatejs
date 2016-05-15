import {ValidationRenderer} from './validation-renderer';
import {inject} from 'aurelia-dependency-injection';
import {ValidationEngine} from './validation-engine';

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