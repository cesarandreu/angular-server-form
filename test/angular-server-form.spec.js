'use strict';

describe('angular-server-form', function () {
  var scope, compile, httpBackend, elm, serverForm, form, err, model;

  beforeEach(function () {
    module('angular-server-form');
    inject(function ($rootScope, $compile, $httpBackend, _serverForm_) {
      scope = $rootScope.$new();
      compile = $compile;
      serverForm = _serverForm_;
      httpBackend = $httpBackend;
    });

  });

  describe('service', function () {

    describe('serialize', function () {

      it('works with flat forms containing a root', function () {

        model = {
          flat: {
            first: 'fistValue',
            second: 'secondValue'
          }
        };
        scope.model = model.flat;

        elm = angular.element(
          '<form name="flat">' +
            '<input name="first" ng-model="model.first" />' +
            '<input name="second" ng-model="model.second" />' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        expect(serverForm.serialize(elm.controller('form'))).toEqual(model);
      });

      it('works with flat forms without a root', function () {
        model = {
          first: 'fistValue',
          second: 'secondValue'
        };
        scope.model = model;

        elm = angular.element(
          '<form>' +
            '<input name="first" ng-model="model.first" />' +
            '<input name="second" ng-model="model.second" />' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        expect(serverForm.serialize(elm.controller('form'))).toEqual(model);
      });

      it('works with nested forms with a root', function () {
        model = {
          nested: {
            first: 'fistValue',
            second: 'secondValue',
            third: {
              fourth: 'fourthValue',
              fifth: 'fifthValue'
            }
          }
        };
        scope.model = model.nested;

        elm = angular.element(
          '<form name="nested">' +
            '<input name="first" ng-model="model.first" />' +
            '<input name="second" ng-model="model.second" />' +
            '<ng-form name="third">' +
              '<input name="fourth" ng-model="model.third.fourth" />' +
              '<input name="fifth" ng-model="model.third.fifth" />' +
            '</ng-form>' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        expect(serverForm.serialize(elm.controller('form'))).toEqual(model);
      });

      it('works with nested forms without a root', function () {
        model = {
          first: 'fistValue',
          second: 'secondValue',
          third: {
            fourth: 'fourthValue',
            fifth: 'fifthValue'
          }
        };
        scope.model = model;

        elm = angular.element(
          '<form>' +
            '<input name="first" ng-model="model.first" />' +
            '<input name="second" ng-model="model.second" />' +
            '<ng-form name="third">' +
              '<input name="fourth" ng-model="model.third.fourth" />' +
              '<input name="fifth" ng-model="model.third.fifth" />' +
            '</ng-form>' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        expect(serverForm.serialize(elm.controller('form'))).toEqual(model);
      });

    });

    describe('applyErrors', function () {

      it('sets errors on flat forms containing a root', function () {

        err = {
          flat: {
            first: 'Error string',
            second: ['Error', 'array']
          }
        };

        model = {
          flat: {
            first: 'fistValue',
            second: 'secondValue'
          }
        };
        scope.model = model.flat;

        elm = angular.element(
          '<form name="flat">' +
            '<input name="first" ng-model="model.first" />' +
            '<input name="second" ng-model="model.second" />' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        form = elm.controller('form');
        serverForm.applyErrors(form, err);

        expect(form.first.$server).toBe(err.flat.first);
        expect(form.second.$server).toBe(err.flat.second.join(', '));
        expect(form.first.$error.server).toBe(true);
        expect(form.second.$error.server).toBe(true);
        expect(form.first.$pristine).toBe(true);
        expect(form.second.$pristine).toBe(true);
      });

      it('sets errors on flat forms without a root', function () {

        err = {
          first: 'Error string',
          second: ['Error', 'array']
        };

        model = {
          first: 'fistValue',
          second: 'secondValue'
        };
        scope.model = model;

        elm = angular.element(
          '<form>' +
            '<input name="first" ng-model="model.first" />' +
            '<input name="second" ng-model="model.second" />' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        form = elm.controller('form');
        serverForm.applyErrors(form, err);

        expect(form.first.$server).toBe(err.first);
        expect(form.second.$server).toBe(err.second.join(', '));
        expect(form.first.$error.server).toBe(true);
        expect(form.second.$error.server).toBe(true);
        expect(form.first.$pristine).toBe(true);
        expect(form.second.$pristine).toBe(true);
      });

      it('sets errors on nested forms with root', function () {

        err = {
          flat: {
            first: 'First error string',
            nested: {
              second: 'Second error string',
              third: ['Third', 'error', 'array']
            }
          }
        };

        model = {
          flat: {
            first: 'fistValue',
            nested: {
              second: 'secondValue',
              third: 'thirdValue'
            }
          }
        };
        scope.model = model;

        elm = angular.element(
          '<form name="flat">' +
            '<input name="first" ng-model="model.first" />' +
            '<ng-form name="nested">' +
              '<input name="second" ng-model="model.nested.second" />' +
              '<input name="third" ng-model="model.nested.third" />' +
            '</ng-form>' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        form = elm.controller('form');
        serverForm.applyErrors(form, err);

        expect(form.first.$server).toBe(err.flat.first);
        expect(form.nested.second.$server).toBe(err.flat.nested.second);
        expect(form.nested.third.$server).toBe(err.flat.nested.third.join(', '));
        expect(form.first.$error.server).toBe(true);
        expect(form.nested.second.$error.server).toBe(true);
        expect(form.nested.third.$error.server).toBe(true);
        expect(form.first.$pristine).toBe(true);
        expect(form.nested.second.$pristine).toBe(true);
        expect(form.nested.third.$pristine).toBe(true);
      });

      it('sets errors on nested forms without root', function () {

        err = {
          first: 'First error string',
          nested: {
            second: 'Second error string',
            third: ['Third', 'error', 'array']
          }
        };

        model = {
          first: 'fistValue',
          nested: {
            second: 'secondValue',
            third: 'thirdValue'
          }
        };
        scope.model = model;

        elm = angular.element(
          '<form>' +
            '<input name="first" ng-model="model.first" />' +
            '<ng-form name="nested">' +
              '<input name="second" ng-model="model.nested.second" />' +
              '<input name="third" ng-model="model.nested.third" />' +
            '</ng-form>' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        form = elm.controller('form');
        serverForm.applyErrors(form, err);

        expect(form.first.$server).toBe(err.first);
        expect(form.nested.second.$server).toBe(err.nested.second);
        expect(form.nested.third.$server).toBe(err.nested.third.join(', '));
        expect(form.first.$error.server).toBe(true);
        expect(form.nested.second.$error.server).toBe(true);
        expect(form.nested.third.$error.server).toBe(true);
        expect(form.first.$pristine).toBe(true);
        expect(form.nested.second.$pristine).toBe(true);
        expect(form.nested.third.$pristine).toBe(true);
      });

    });

    describe('clearErrors', function () {

      it('clears errors on flat forms containing a root', function () {

        err = {
          flat: {
            first: 'Error string',
            second: ['Error', 'array']
          }
        };

        model = {
          flat: {
            first: 'fistValue',
            second: 'secondValue'
          }
        };
        scope.model = model.flat;

        elm = angular.element(
          '<form name="flat">' +
            '<input name="first" ng-model="model.first" />' +
            '<input name="second" ng-model="model.second" />' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        form = elm.controller('form');
        serverForm.applyErrors(form, err);

        expect(form.first.$server).toBe(err.flat.first);
        expect(form.second.$server).toBe(err.flat.second.join(', '));
        expect(form.first.$error.server).toBe(true);
        expect(form.second.$error.server).toBe(true);

        serverForm.clearErrors(form);
        expect(form.$server).toBe('');
        expect(form.first.$server).toBe('');
        expect(form.second.$server).toBe('');
        expect(form.first.$error.server).toBe(false);
        expect(form.second.$error.server).toBe(false);
      });

      it('clears errors on flat forms without a root', function () {

        err = {
          first: 'Error string',
          second: ['Error', 'array']
        };

        model = {
          first: 'fistValue',
          second: 'secondValue'
        };
        scope.model = model;

        elm = angular.element(
          '<form>' +
            '<input name="first" ng-model="model.first" />' +
            '<input name="second" ng-model="model.second" />' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        form = elm.controller('form');
        serverForm.applyErrors(form, err);

        expect(form.first.$server).toBe(err.first);
        expect(form.second.$server).toBe(err.second.join(', '));
        expect(form.first.$error.server).toBe(true);
        expect(form.second.$error.server).toBe(true);

        serverForm.clearErrors(form);
        expect(form.$server).toBe('');
        expect(form.first.$server).toBe('');
        expect(form.second.$server).toBe('');
        expect(form.first.$error.server).toBe(false);
        expect(form.second.$error.server).toBe(false);
      });

      it('clears errors on nested forms with root', function () {

        err = {
          flat: {
            first: 'First error string',
            nested: {
              second: 'Second error string',
              third: ['Third', 'error', 'array']
            }
          }
        };

        model = {
          flat: {
            first: 'fistValue',
            nested: {
              second: 'secondValue',
              third: 'thirdValue'
            }
          }
        };
        scope.model = model;

        elm = angular.element(
          '<form name="flat">' +
            '<input name="first" ng-model="model.first" />' +
            '<ng-form name="nested">' +
              '<input name="second" ng-model="model.nested.second" />' +
              '<input name="third" ng-model="model.nested.third" />' +
            '</ng-form>' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        form = elm.controller('form');
        serverForm.applyErrors(form, err);

        expect(form.first.$server).toBe(err.flat.first);
        expect(form.nested.second.$server).toBe(err.flat.nested.second);
        expect(form.nested.third.$server).toBe(err.flat.nested.third.join(', '));
        expect(form.first.$error.server).toBe(true);
        expect(form.nested.second.$error.server).toBe(true);
        expect(form.nested.third.$error.server).toBe(true);

        serverForm.clearErrors(form);
        expect(form.$server).toBe('');
        expect(form.first.$server).toBe('');
        expect(form.nested.$server).toBe('');
        expect(form.nested.second.$server).toBe('');
        expect(form.nested.third.$server).toBe('');
        expect(form.first.$error.server).toBe(false);
        expect(form.nested.second.$error.server).toBe(false);
        expect(form.nested.third.$error.server).toBe(false);
      });

      it('clears errors on nested forms without root', function () {

        err = {
          first: 'First error string',
          nested: {
            second: 'Second error string',
            third: ['Third', 'error', 'array']
          }
        };

        model = {
          first: 'fistValue',
          nested: {
            second: 'secondValue',
            third: 'thirdValue'
          }
        };
        scope.model = model;

        elm = angular.element(
          '<form>' +
            '<input name="first" ng-model="model.first" />' +
            '<ng-form name="nested">' +
              '<input name="second" ng-model="model.nested.second" />' +
              '<input name="third" ng-model="model.nested.third" />' +
            '</ng-form>' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        form = elm.controller('form');
        serverForm.applyErrors(form, err);

        expect(form.first.$server).toBe(err.first);
        expect(form.nested.second.$server).toBe(err.nested.second);
        expect(form.nested.third.$server).toBe(err.nested.third.join(', '));
        expect(form.first.$error.server).toBe(true);
        expect(form.nested.second.$error.server).toBe(true);
        expect(form.nested.third.$error.server).toBe(true);

        serverForm.clearErrors(form);
        expect(form.$server).toBe('');
        expect(form.first.$server).toBe('');
        expect(form.nested.$server).toBe('');
        expect(form.nested.second.$server).toBe('');
        expect(form.nested.third.$server).toBe('');
        expect(form.first.$error.server).toBe(false);
        expect(form.nested.second.$error.server).toBe(false);
        expect(form.nested.third.$error.server).toBe(false);
      });

    });

    describe('submit', function () {

      describe('$submitting and $saved', function () {

        beforeEach(function () {

          scope.model = {
            first: 'fistValue'
          };

          elm = angular.element(
            '<form>' +
              '<input name="first" ng-model="model.first" />' +
            '</form>');
          elm = compile(elm)(scope);
          scope.$digest();

          form = elm.controller('form');
        });

        it('changes $submitting and $saved values on success', function () {
          httpBackend
          .when('POST', '/endpoint')
          .respond(200, {});

          serverForm.submit(form, {
            url: '/endpoint',
            method: 'POST'
          });
          expect(form.$saved).toEqual(false);
          expect(form.$submitting).toEqual(true);
          httpBackend.flush();
          expect(form.$submitting).toEqual(false);
          expect(form.$saved).toEqual(true);
        });

        it('changes $submitting and $saved values on failure', function () {
          httpBackend
          .when('POST', '/endpoint')
          .respond(400, {});

          serverForm.submit(form, {
            url: '/endpoint',
            method: 'POST'
          });
          expect(form.$saved).toEqual(false);
          expect(form.$submitting).toEqual(true);
          httpBackend.flush();
          expect(form.$submitting).toEqual(false);
          expect(form.$saved).toEqual(false);
        });

      });


      it('calls clearErrors', function () {

        httpBackend
        .when('POST', '/endpoint')
        .respond(200, {});

        scope.model = {
          first: 'fistValue'
        };

        elm = angular.element(
          '<form>' +
            '<input name="first" ng-model="model.first" />' +
          '</form>');
        elm = compile(elm)(scope);
        scope.$digest();

        form = elm.controller('form');

        spyOn(serverForm, 'clearErrors');

        serverForm.submit(form, {
          url: '/endpoint',
          method: 'POST'
        });
        httpBackend.flush();
        expect(serverForm.clearErrors).toHaveBeenCalledWith(form);
        serverForm.clearErrors.reset();
      });

    });

  });

  describe('directive', function () {

    describe('failure', function () {

      beforeEach(function () {

        err = {
          errors: {
            animals: {
              count: 'Must be under 100'
            }
          }
        };

        scope.count = 100;
        scope.url = '/error';
        scope.success = function () {};
        scope.error = function () {};

        spyOn(serverForm, 'submit').andCallThrough();
        spyOn(serverForm, 'serialize').andCallThrough();
        spyOn(scope, 'success').andCallThrough();
        spyOn(scope, 'error').andCallThrough();

        httpBackend
        .when('POST', '/error')
        .respond(422, err);

        elm = angular.element(
          '<form name="animals" server-form method="POST" url="{{url}}" on-success="success" on-error="error">' +
            '<input type="number" ng-model="count" name="count" />' +
          '</form>');

        elm = compile(elm)(scope);
        scope.$digest();
        form = elm.controller('form');

        elm.triggerHandler('submit');
        httpBackend.flush();
      });

      afterEach(function () {

        serverForm.submit.reset();
        serverForm.serialize.reset();
        scope.success.reset();
        scope.error.reset();
      });

      it('adds errors to form', function () {

        expect(form.count.$server).toEqual('Must be under 100');
        expect(form.count.$error.server).toEqual(true);
      });

      it('calls on-error on failure', function () {

        expect(scope.success).not.toHaveBeenCalled();
        expect(scope.error).toHaveBeenCalled();
      });

      it('calls serialize and submit', function () {

        expect(serverForm.serialize).toHaveBeenCalledWith(form);
        expect(serverForm.submit).toHaveBeenCalledWith(form, {
          url: '/error',
          method: 'POST',
          data: {
            animals: {
              count: 100
            }
          }
        });
      });

    });

    describe('success', function () {

      beforeEach(function () {

        scope.count = 100;
        scope.url = '/success';
        scope.success = function () {};
        scope.error = function () {};

        spyOn(serverForm, 'submit').andCallThrough();
        spyOn(serverForm, 'serialize').andCallThrough();
        spyOn(scope, 'success').andCallThrough();
        spyOn(scope, 'error').andCallThrough();

        httpBackend
        .when('POST', '/success')
        .respond(200, {});

        elm = angular.element(
          '<form name="animals" server-form method="POST" url="{{url}}" on-success="success" on-error="error">' +
            '<input type="number" ng-model="count" name="count" />' +
          '</form>');

        elm = compile(elm)(scope);
        scope.$digest();
        form = elm.controller('form');

        elm.triggerHandler('submit');
        httpBackend.flush();
      });

      afterEach(function () {

        serverForm.submit.reset();
        serverForm.serialize.reset();
        scope.success.reset();
        scope.error.reset();
      });

      it('calls on-success on success', function () {

        expect(scope.success).toHaveBeenCalled();
        expect(scope.error).not.toHaveBeenCalled();
      });

      it('calls serialize and submit', function () {

        expect(serverForm.serialize).toHaveBeenCalledWith(form);
        expect(serverForm.submit).toHaveBeenCalledWith(form, {
          url: '/success',
          method: 'POST',
          data: {
            animals: {
              count: 100
            }
          }
        });
      });

    });

    describe('both', function () {

      beforeEach(function () {

        err = {
          errors: {
            animals: {
              count: 'Must be under 100'
            }
          }
        };

        scope.count = 100;
        scope.url = '/error';
        scope.success = function () {};
        scope.error = function () {};

        spyOn(scope, 'success').andCallThrough();
        spyOn(scope, 'error').andCallThrough();

        httpBackend
        .when('POST', '/error')
        .respond(422, err);

        httpBackend
        .when('POST', '/success')
        .respond(200, {});

        elm = angular.element(
          '<form name="animals" server-form method="POST" url="{{url}}" on-success="success" on-error="error">' +
            '<input type="number" ng-model="count" name="count" />' +
          '</form>');

        elm = compile(elm)(scope);
        scope.$digest();
        form = elm.controller('form');
      });

      afterEach(function () {

        scope.success.reset();
        scope.error.reset();
      });

      it('adds errors to form', function () {

        elm.triggerHandler('submit');
        httpBackend.flush();
        expect(form.count.$server).toEqual('Must be under 100');
        expect(form.count.$error.server).toEqual(true);
        expect(scope.error).toHaveBeenCalled();

        scope.url = '/success';
        scope.$digest();

        elm.triggerHandler('submit');
        httpBackend.flush();
        expect(form.count.$server).toEqual('');
        expect(form.count.$error.server).toEqual(false);
        expect(form.$saved).toEqual(true);
        expect(scope.success).toHaveBeenCalled();
      });


    });

  });

});
