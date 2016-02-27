'use strict';

require('../index');

var ngmock = angular.mock;

describe('angular-number', function() {

  describe('numberinput', function() {

    var $compile, $rootScope, $timeout, $scope;

    beforeEach(ngmock.module('rea.misc.number', function($provide) {
      $provide.value('$log', console);
    }));
    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;

      $scope = $rootScope.$new();
    }));

    beforeEach(function() {});

    it('should compile probably and attach to element', function() {
      $scope.test = 1.111;

      var html = angular.element('<input numberinput ng-model="test"></input>');
      var element = $compile(html)($scope);
      var ngModelCtrl = element.controller('ngModel');

      $rootScope.$apply();

      expect(ngModelCtrl.$viewValue).toEqual('1.11');

      html.triggerHandler('blur');
      $rootScope.$apply();

      expect($scope.test).toEqual(1.11);
    });

    it('should set maxlength attribute if not there', function() {
      $scope.test = 1.111;

      var html = angular.element('<input numberinput ng-model="test"></input>');
      var element = $compile(html)($scope);

      $rootScope.$apply();

      expect(element.attr('maxlength')).toEqual('15');
    });

    it('should consider number of decimals', function() {
      $scope.test = 2.22;

      var html = angular.element('<input numberinput="3" ng-model="test"></input>');
      var element = $compile(html)($scope);
      var ngModelCtrl = element.controller('ngModel');

      $rootScope.$apply();
      expect(ngModelCtrl.$viewValue).toEqual('2.220');

      html.triggerHandler('blur');
      expect($scope.test).toEqual(2.220);
    });

    it('should convert , to .', function() {
      $scope.test = '2,30';

      var html = angular.element('<input numberinput="1" ng-model="test"></input>');
      var element = $compile(html)($scope);
      var ngModelCtrl = element.controller('ngModel');

      $rootScope.$apply();
      expect(ngModelCtrl.$viewValue).toEqual('2.3');

      html.triggerHandler('blur');
      expect($scope.test).toEqual(2.3);
    });

    it('should work with `undefined`', function() {
      $scope.test = undefined;
      var html = '<input numberinput ng-model="test"></input>';
      var element = angular.element(html);
      var compiled = $compile(element)($scope);
      var ngModelCtrl = compiled.controller('ngModel');

      $rootScope.$apply();
      expect(ngModelCtrl.$viewValue).toEqual('0.00');

      element.triggerHandler('blur');
      expect(ngModelCtrl.$modelValue).toEqual(0);
    });

    it('should work with `0`', function() {
      $scope.test = 0;
      var html = '<input numberinput ng-model="test"></input>';
      var element = angular.element(html);
      var compiled = $compile(element)($scope);
      var ngModelCtrl = compiled.controller('ngModel');

      $rootScope.$apply();
      expect(ngModelCtrl.$viewValue).toEqual('0.00');
      expect($scope.test).toEqual(0.0);
    });

    it('should convert `0` to `0.00`', function() {
      $scope.test = 1;
      var html = '<input numberinput ng-model="test"></input>';
      var element = angular.element(html);
      var compiled = $compile(element)($scope);
      var ngModelCtrl = compiled.controller('ngModel');

      ngModelCtrl.$setViewValue('0');
      element.triggerHandler('blur');

      $rootScope.$apply();
      expect(ngModelCtrl.$viewValue).toEqual('0.00');
      expect($scope.test).toEqual(0.0);
    });

    it('should convert `20` to `20.00`', function() {
      $scope.test = 1;
      var html = '<input numberinput="2" ng-model="test"></input>';
      var element = angular.element(html);
      var compiled = $compile(element)($scope);
      var ngModelCtrl = compiled.controller('ngModel');

      ngModelCtrl.$setViewValue('20');
      element.triggerHandler('blur');

      $rootScope.$apply();
      expect(ngModelCtrl.$viewValue).toEqual('20.00');
      expect($scope.test).toEqual(20.0);
    });

    it('should throw away all decimals with numberinput=0', function() {
      $scope.test = 20.01;
      var html = '<input numberinput="0" ng-model="test"></input>';
      var element = angular.element(html);
      var compiled = $compile(element)($scope);
      var ngModelCtrl = compiled.controller('ngModel');

      $rootScope.$apply();

      expect(ngModelCtrl.$viewValue).toEqual('20');
      expect(ngModelCtrl.$modelValue).toEqual('20');
      // expect($scope.test).toEqual(20);
    });

    it('should handle invalid model values', function() {
      $scope.test = 'abcd';
      var html = '<input numberinput="3" ng-model="test"></input>';
      var element = angular.element(html);
      var compiled = $compile(element)($scope);
      var ngModelCtrl = compiled.controller('ngModel');

      $rootScope.$apply();

      expect(ngModelCtrl.$viewValue).toEqual('0.000');
      expect(ngModelCtrl.$modelValue).toEqual('0.000');
      // expect($scope.test).toEqual(0.000);
    });

    it('should handle invalid input values', function() {
      $scope.test = '';
      var html = '<input numberinput="3" ng-model="test"></input>';
      var element = angular.element(html);
      var compiled = $compile(element)($scope);
      var ngModelCtrl = compiled.controller('ngModel');

      $rootScope.$apply();
      element.triggerHandler('blur');

      expect(ngModelCtrl.$viewValue).toEqual('0.000');
      expect($scope.test).toEqual(0.000);
    });

    it('should keep the input $pristine', function() {
      $scope.test = 0.000;
      var form = '<form></form>';
      var formElement = angular.element(form);

      var html = '<input name="test" numberinput="3" ng-model="test"></input>';
      var element = angular.element(html);
      $compile(element)($scope);

      formElement.append(element);
      var formCompiled = $compile(formElement)($scope);
      var formCtrl = formCompiled.controller('form');

      $rootScope.$apply();

      expect(formCtrl.test.$pristine).toEqual(true);
    });

  });

});
