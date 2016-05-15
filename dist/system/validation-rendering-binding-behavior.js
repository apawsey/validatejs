'use strict';

System.register(['./validation-renderer', 'aurelia-dependency-injection', './validation-engine'], function (_export, _context) {
  var ValidationRenderer, inject, ValidationEngine, _dec, _class, ValidationRenderingBindingBehavior;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_validationRenderer) {
      ValidationRenderer = _validationRenderer.ValidationRenderer;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_validationEngine) {
      ValidationEngine = _validationEngine.ValidationEngine;
    }],
    execute: function () {
      _export('ValidationRenderingBindingBehavior', ValidationRenderingBindingBehavior = (_dec = inject(ValidationRenderer), _dec(_class = function () {
        function ValidationRenderingBindingBehavior(renderer) {
          _classCallCheck(this, ValidationRenderingBindingBehavior);

          this.renderer = renderer;
          this.liveBinding = false;
        }

        ValidationRenderingBindingBehavior.prototype.bind = function bind(binding, source) {
          var _this = this;

          var targetProperty = void 0;
          var target = void 0;
          var reporter = void 0;
          source._dirty = false;
          binding.target.addEventListener('blur', function (event) {
            source._dirty = true;
          });
          targetProperty = this.getTargetProperty(binding);
          target = this.getTargetObject(binding);
          reporter = ValidationEngine.getOrCreateValidationReporter(target);
          reporter.subscribe(function (errors, pushRendering) {
            var relevantErrors = errors.filter(function (error) {
              return error.propertyName === targetProperty;
            });
            if (_this.liveBinding && source._dirty || pushRendering) _this.renderer.renderErrors(binding.target, relevantErrors);
          });
        };

        ValidationRenderingBindingBehavior.prototype.unbind = function unbind(binding, source) {};

        ValidationRenderingBindingBehavior.prototype.getTargetProperty = function getTargetProperty(binding) {
          var targetProperty = void 0;
          if (binding.sourceExpression && binding.sourceExpression.expression && binding.sourceExpression.expression.name) {
            targetProperty = binding.sourceExpression.expression.name;
          }
          return targetProperty;
        };

        ValidationRenderingBindingBehavior.prototype.getTargetObject = function getTargetObject(binding) {
          var targetObject = void 0;
          if (binding.sourceExpression && binding.sourceExpression.expression && binding.sourceExpression.expression.object) {
            targetObject = binding.source.bindingContext[binding.sourceExpression.expression.object.name];
          } else {
            targetObject = binding.source.bindingContext;
          }
          return targetObject;
        };

        ValidationRenderingBindingBehavior.prototype.getPropertyContext = function getPropertyContext(source, targetProperty) {
          var target = getContextFor(source, targetProperty);
          return target;
        };

        return ValidationRenderingBindingBehavior;
      }()) || _class));

      _export('ValidationRenderingBindingBehavior', ValidationRenderingBindingBehavior);
    }
  };
});