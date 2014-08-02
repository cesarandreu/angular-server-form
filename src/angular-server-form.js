(function (window, angular) {
  'use strict';

  angular.module('angular-server-form', [])
  .provider('serverForm', [function () {

    var provider = this;

    provider.errorsKey = 'errors';
    provider.logging = true;
    provider.$get = ['$http', '$q', '$log', function ($http, $q, $log) {

      // Private
      // Set error message on form value
      function setError (form, message) {
        // Only NgModelController has $render and $setViewValue
        // Don't call $setValidity on FormController
        if (form.$render || form.$setViewValue) {
          form.$setValidity('server', false);
        }
        form.$setPristine();
        form.$server = message;
      }

      // Private
      // recurse over the form
      // if the property is a value it gets assigned
      // otherwise dive inside
      function formCrawler (form) {
        var response = {};
        for (var prop in form) {
          if (form.hasOwnProperty(prop) && prop[0] !== '$') {
            if (form[prop].hasOwnProperty('$modelValue')) {
              response[prop] = form[prop].$modelValue;
            } else {
              response[prop] = formCrawler(form[prop]);
            }
          }
        }
        return response;
      }

      var self = this;

      // Serialize form to data object
      self.serialize = function serialize (form) {
        var response = {};

        // set root if form name is set
        if (form.$name) {
          response[form.$name] = formCrawler(form);
        } else {
          response = formCrawler(form);
        }
        return response;
      };

      // Apply all messages from errors object on form
      // The error value must be an array of strings or a string
      self.applyErrors = function applyErrors (form, errors) {
        if (angular.isString(errors)) {
          // If it's a string then set the error message
          setError(form, errors);
        } else if (angular.isArray(errors)) {
          // If it's an array then join them and set the error message
          setError(form, errors.join(', '));
        } else {
          // Otherwise we must crawl the errors
          for (var prop in errors) {
            if (errors.hasOwnProperty(prop)) {
              if (form.hasOwnProperty(prop)) {
                // If the form has a property with the same error name
                self.applyErrors(form[prop], errors[prop]);
              } else if (form.$name === prop) {
                // errors object is for the whole form, dive in
                self.applyErrors(form, errors[prop]);
              } else {
                if (provider.logging) {
                  $log.warn('No place to render property', prop, 'in form', form);
                }
              }
            }
          }
        }
      };

      // Crawl form and reset errors
      self.clearErrors = function clearErrors (form) {
        // Only NgModelController has $render and $setViewValue
        // Don't call $setValidity on FormController
        if (form.$render || form.$setViewValue) {
          form.$setValidity('server', true);
        }
        form.$setPristine();
        form.$server = '';

        for (var prop in form) {
          if (form.hasOwnProperty(prop) && prop[0] !== '$') {
            clearErrors(form[prop]);
          }
        }
      };

      self.submit = function submit (form, config) {
        self.clearErrors(form); // resets previous server errors
        form.$submitting = true;
        form.$saved = false;

        return $http(config)
          .success(function () {
            form.$saved = true;
          })
          .error(function(res, status) {
            form.$saved = false;
            if (status === 422) {
              if (provider.errorsKey) {
                self.applyErrors(form, res[provider.errorsKey]);
              } else {
                self.applyErrors(form, res);
              }
            }
          })
          .finally(function () {
            form.$submitting = false;
          });
      };

      return self;
    }];
  }])
  .directive('serverForm', ['serverForm', function (serverForm) {

    return {
      restrict: 'A',
      scope: {
        url: '@',
        method: '@',
        onSuccess: '=',
        onError: '='
      },
      require: 'form',
      link: function postLink(scope, iElement, iAttrs, form) {

        function submitForm (ev) {
          scope.$apply(function () {
            if (!form.$submitting) {
              var config = {
                url: scope.url,
                method: scope.method ? scope.method : 'POST',
                data: serverForm.serialize(form)
              };

              serverForm.submit(form, config)
              .then(scope.onSuccess, scope.onError);
            }

            ev.preventDefault();
          });
        }

        iElement.on('submit', submitForm);
        scope.$on('destroy', function () {
          iElement.off('submit', submitForm);
        });

      }
    };
  }]);

})(window, window.angular);
