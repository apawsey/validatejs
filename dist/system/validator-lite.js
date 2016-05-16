'use strict';

System.register(['./validation-ruleset', './validation-rule', './validation-engine'], function (_export, _context) {
  var ValidationRuleset, ValidationRule, ValidationEngine, ValidatorLite;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_validationRuleset) {
      ValidationRuleset = _validationRuleset.ValidationRuleset;
    }, function (_validationRule) {
      ValidationRule = _validationRule.ValidationRule;
    }, function (_validationEngine) {
      ValidationEngine = _validationEngine.ValidationEngine;
    }],
    execute: function () {
      _export('ValidatorLite', ValidatorLite = function (_ValidationRuleset) {
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
          for (var _iterator = ruleset, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref = _i.value;
            }

            var rule = _ref;

            this.addRule(rule.key, new ValidationRule(rule.rule.name, JSON.parse(JSON.stringify(rule.rule.config))));
          }
        };

        ValidatorLite.prototype.getProperties = function getProperties() {
          console.error('Not yet implemented');
        };

        ValidatorLite.for = function _for(object) {
          return new ValidatorLite(object);
        };

        ValidatorLite.prototype.validate = function validate(property) {
          if (property) {
            return _ValidationRuleset.prototype.validate.call(this, this.targetObject, property, true);
          } else {
            return _ValidationRuleset.prototype.validate.call(this, this.targetObject, null, true);
          }
        };

        ValidatorLite.prototype.getValidationReporter = function getValidationReporter() {
          return ValidationEngine.getOrCreateValidationReporter(this.targetObject);
        };

        return ValidatorLite;
      }(ValidationRuleset));

      _export('ValidatorLite', ValidatorLite);
    }
  };
});