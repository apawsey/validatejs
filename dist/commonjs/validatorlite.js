'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidatorLite = undefined;

var _validationRuleset = require('./validation-ruleset');

var _validationRule = require('./validation-rule');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValidatorLite = exports.ValidatorLite = function (_ValidationRuleset) {
  _inherits(ValidatorLite, _ValidationRuleset);

  function ValidatorLite(targetObject) {
    _classCallCheck(this, ValidatorLite);

    var _this = _possibleConstructorReturn(this, _ValidationRuleset.call(this));

    _this.targetObject = targetObject;
    return _this;
  }

  ValidatorLite.prototype.addRule = function addRule(key, rule) {
    _ValidationRuleset.prototype.addRule.call(this, key, rule);
  };

  ValidatorLite.prototype.importRuleset = function importRuleset(ruleset) {
    var _this2 = this;

    ruleset.forEach(function (rule) {
      _this2.addRule(rule.key, new _validationRule.ValidationRule(rule.value.name, JSON.parse(JSON.stringify(rule.value.config))));
    });
  };

  ValidatorLite.prototype.getProperties = function getProperties() {
    console.error('Not yet implemented');
  };

  ValidatorLite.for = function _for(object) {
    return new ValidatorLite(object);
  };

  ValidatorLite.prototype.validate = function validate(property) {
    if (property) {
      return this.ruleset.validate(this.targetObject, property, true);
    } else {
      return this.ruleset.validate(this.targetObject, null, true);
    }
  };

  ValidatorLite.prototype.getValidationReporter = function getValidationReporter() {
    return ValidationEngine.getOrCreateValidationReporter(this.targetObject);
  };

  return ValidatorLite;
}(_validationRuleset.ValidationRuleset);