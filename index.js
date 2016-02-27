'use strict';

angular.module('angular-number', [])
  .directive('numberinput', NumberInput);

var DEFAULT_DECIMAL_PLACES = 2;
var FALLBACK = '0.00';

NumberInput.$inject = [];
function NumberInput() {

  return {
    restrict: 'A',
    require: ['ngModel'],
    scope: {
      numberinput: '=',
      onNumberValid: '&'
    },
    link: link
  };

  function link($scope, element, attrs, ctrl) {

    var ngModelCtrl = ctrl[0];

    if (!attrs.maxlength) {
      attrs.$set('maxlength', 15);
    }

    var len = getLength($scope.numberinput);

    element.on('blur', onBlur);
    ngModelCtrl.$formatters.push(formatter);
    ngModelCtrl.$parsers.unshift(parse);
    ngModelCtrl.$viewChangeListeners.push(changeListener);

    function changeListener() {
      // $log.debug('changeListener');
      var value = String(ngModelCtrl.$viewValue);

      if (value.match && value.match(/,|[^-0-9,\.]/)) {
        value = toNumberWithDots(value).toFixed(len);
        setViewlValue(value, ngModelCtrl);
      }

      if ($scope.onNumberValid) {
        $scope.onNumberValid();
      }
    }

    function onBlur() {
      // $log.debug('onBlur');
      var num = toNumberWithDots(ngModelCtrl.$viewValue);
      num = (isNaN(num) || num === 0) ? FALLBACK : num;

      var value = parseFloat(num).toFixed(len);
      setViewlValue(value, ngModelCtrl);
    }

    function formatter(data) {
      // $log.debug('formatter', data);

      var ret = (angular.isDefined(data)) ?
        toNumberWithDots(data).toFixed(len) : FALLBACK;

      if (ret !== data) {
        ngModelCtrl.$modelValue = ret;
      }

      return ret;
    }

    function parse(value) {
      // $log.debug('parse', value);
      return parseFloat(value) || 0;
    }
  }
}

function setViewlValue(value, ngModelCtrl) {
  var old = ngModelCtrl.$viewValue;

  // dirty check will not work, force pipeline
  if (old === value) {
    ngModelCtrl.$setViewValue('');
  }

  ngModelCtrl.$setViewValue(value);

  // angular >= 1.3
  if (ngModelCtrl.$commitViewValue) {
    ngModelCtrl.$commitViewValue();
  }

  ngModelCtrl.$render();
}

function getLength(val) {
  var parsed = parseInt(val);
  return (!isNaN(parsed) && angular.isDefined(parsed)) ?
    parsed : DEFAULT_DECIMAL_PLACES;
}

function toNumberWithDots(val) {

  val = val || '';
  val = String(val).replace(',', '.', 'g').replace(/[^-0-9,\.]/, '');
  return parseFloat(val) || parseFloat(FALLBACK);
}
