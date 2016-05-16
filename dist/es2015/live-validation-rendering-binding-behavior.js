var _dec, _class;

import { ValidationRenderer } from './validation-renderer';
import { inject } from 'aurelia-dependency-injection';
import { ValidationEngine } from './validation-engine';

export let LiveValidationRenderingBindingBehavior = (_dec = inject(ValidationRenderer), _dec(_class = class LiveValidationRenderingBindingBehavior {
  constructor(renderer) {
    this.renderer = renderer;
    this.liveBinding = true;
  }

  bind(binding, source) {
    let targetProperty;
    let target;
    let reporter;

    binding.target._dirty = false;
    binding.target.addEventListener('focus', event => {
      binding.target._dirty = true;
    });
    targetProperty = this.getTargetProperty(binding);
    target = this.getTargetObject(binding);
    reporter = ValidationEngine.getOrCreateValidationReporter(target);
    reporter.subscribe((errors, pushRendering) => {
      let relevantErrors = errors.filter(error => {
        return error.propertyName === targetProperty;
      });

      if (this.liveBinding && binding.target._dirty || pushRendering) this.renderer.renderErrors(binding.target, relevantErrors);
    });
  }

  unbind(binding, source) {}

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
    } else {
      targetObject = binding.source.bindingContext;
    }
    return targetObject;
  }
  getPropertyContext(source, targetProperty) {
    let target = getContextFor(source, targetProperty);
    return target;
  }
}) || _class);