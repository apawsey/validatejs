'use strict';

System.register(['aurelia-metadata', './validation-ruleset', './validation-engine', './metadata-key', './property-observer'], function (_export, _context) {
  var metadata, ValidationRuleset, ValidationEngine, validationMetadataKey, observeProperty, Validator;

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
    setters: [function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }, function (_validationRuleset) {
      ValidationRuleset = _validationRuleset.ValidationRuleset;
    }, function (_validationEngine) {
      ValidationEngine = _validationEngine.ValidationEngine;
    }, function (_metadataKey) {
      validationMetadataKey = _metadataKey.validationMetadataKey;
    }, function (_propertyObserver) {
      observeProperty = _propertyObserver.observeProperty;
    }],
    execute: function () {
      _export('Validator', Validator = function (_ValidatorLite) {
        _inherits(Validator, _ValidatorLite);

        function Validator(targetObject) {
          _classCallCheck(this, Validator);

          var _this = _possibleConstructorReturn(this, _ValidatorLite.call(this, targetObject));

          var ruleset = metadata.getOrCreateOwn(validationMetadataKey, ValidationRuleset, Object.getPrototypeOf(_this.targetObject));
          _this.ruleset = ruleset;
          return _this;
        }

        Validator.prototype.addRule = function addRule(key, rule) {
          observeProperty(this.targetObject, key, undefined, null, rule);
        };

        Validator.for = function _for(object) {
          return new Validator(object);
        };

        Validator.prototype.validate = function validate(property) {
          ValidationEngine.ensureValidationReporter(this.targetObject);
          return _ValidatorLite.prototype.validate.call(this, property);
        };

        return Validator;
      }(ValidatorLite));

      _export('Validator', Validator);
    }
  };
});