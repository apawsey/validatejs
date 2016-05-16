'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationRenderer = undefined;

var _aureliaPal = require('aurelia-pal');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationRenderer = exports.ValidationRenderer = function () {
  function ValidationRenderer() {
    _classCallCheck(this, ValidationRenderer);
  }

  ValidationRenderer.prototype.renderErrors = function renderErrors(node, relevantErrors) {
    if (relevantErrors.length) {
      this.unrenderErrors(node);
      node.parentElement.classList.add('has-error');
      relevantErrors.forEach(function (error) {
        if (node.parentElement.textContent.indexOf(error.message) === -1) {
          var errorMessageHelper = _aureliaPal.DOM.createElement('span');
          var errorMessageNode = _aureliaPal.DOM.createTextNode(error.message);
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
  };

  ValidationRenderer.prototype.unrenderErrors = function unrenderErrors(node) {
    var deleteThese = [];
    node.parentElement.classList.remove('has-error');
    var children = node.parentElement.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.classList.contains('help-block') && child.classList.contains('au-validation')) {
        deleteThese.push(child);
      }
    }
    deleteThese.forEach(function (child) {
      node.parentElement.removeChild(child);
    });
  };

  return ValidationRenderer;
}();