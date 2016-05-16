'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LiveValidationRenderingBindingBehavior = undefined;

var _dec, _class;

var _validationRenderer = require('./validation-renderer');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _validationEngine = require('./validation-engine');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LiveValidationRenderingBindingBehavior = exports.LiveValidationRenderingBindingBehavior = (_dec = (0, _aureliaDependencyInjection.inject)(_validationRenderer.ValidationRenderer), _dec(_class = function () {
  function LiveValidationRenderingBindingBehavior(renderer) {
    _classCallCheck(this, LiveValidationRenderingBindingBehavior);

    this.renderer = renderer;
    this.liveBinding = true;
  }

  LiveValidationRenderingBindingBehavior.prototype.bind = function bind(binding, source) {
    var _this = this;

    var targetProperty = void 0;
    var target = void 0;
    var reporter = void 0;

    binding.target._dirty = false;
    binding.target.addEventListener('focus', function (event) {
      binding.target._dirty = true;
    });
    targetProperty = this.getTargetProperty(binding);
    target = this.getTargetObject(binding);
    reporter = _validationEngine.ValidationEngine.getOrCreateValidationReporter(target);
    reporter.subscribe(function (errors, pushRendering) {
      var relevantErrors = errors.filter(function (error) {
        return error.propertyName === targetProperty;
      });

      if (_this.liveBinding && binding.target._dirty || pushRendering) _this.renderer.renderErrors(binding.target, relevantErrors);
    });
  };

  LiveValidationRenderingBindingBehavior.prototype.unbind = function unbind(binding, source) {};

  LiveValidationRenderingBindingBehavior.prototype.getTargetProperty = function getTargetProperty(binding) {
    var targetProperty = void 0;
    if (binding.sourceExpression && binding.sourceExpression.expression && binding.sourceExpression.expression.name) {
      targetProperty = binding.sourceExpression.expression.name;
    }
    return targetProperty;
  };

  LiveValidationRenderingBindingBehavior.prototype.getTargetObject = function getTargetObject(binding) {
    var targetObject = void 0;
    if (binding.sourceExpression && binding.sourceExpression.expression && binding.sourceExpression.expression.object) {
      targetObject = binding.source.bindingContext[binding.sourceExpression.expression.object.name];
    } else {
      targetObject = binding.source.bindingContext;
    }
    return targetObject;
  };

  LiveValidationRenderingBindingBehavior.prototype.getPropertyContext = function getPropertyContext(source, targetProperty) {
    var target = getContextFor(source, targetProperty);
    return target;
  };

  return LiveValidationRenderingBindingBehavior;
}()) || _class);