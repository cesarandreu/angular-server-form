# angular-server-form

[![Build Status](https://travis-ci.org/cesarandreu/angular-server-form.svg?branch=master)](https://travis-ci.org/cesarandreu/angular-server-form)

angular-server-form provides a directive and service to simplify server-side validation.
It provides automatic propagation of server-side errors on your forms. 


## Installation

You can install angular-server-form with bower:

```shell
bower install angular-server-form
```

Otherwise you can download the files from the `dist` folder and include them in your project.

Then you must include `angular-server-form` as a module dependency.

```javascript
var app = angular.module('app', ['angular-server-form']);
```

## Examples

To view examples do the following:

1. Clone this repo
2. Run `npm install` and `bower install`
3. Run `npm run examples`
4. Navigate to `127.0.0.1:9999` with your browser

You can view the source for all examples in the `examples` folder.


## Directive

`server-form` serializes your form into an object, submits it, and applies errors on the form controller if a 422 response is received.

### Details

* Serializes the form controller on submit by calling `serverForm.serialize`
* Submits the serialized form using `serverForm.submit`
* Does not allow you to submit the form if it is already submitting

### Attributes

* **url** : String (required) - url to which the form must be submitted
* **method** : String - http method to use when submitting the form, default: `POST`
* **on-success** : Function - callback for when form submission is successful
* **on-error** : Function - callback for when form submission is unsuccessful

### Example

**Controller**

```javascript
$scope.model = {
  favorite: 'banana'
};
```

**View**

```html
<form name="fruits" server-form url="/fruits">
  <label>
    Favorite: <input name="favorite" ng-model="model.favorite" />
  </label>
  <button type="submit">Submit</button>
</form>
```

## Service

`serverForm` is a service to assist in handling forms with server-side validation.

### Configuration

Inject `serverFormProvider` to set the following:

* logging : Boolean - controls whether or not to log a message when a server error cannot be rendered, default: `true`
* errorsKey : String - object key to check for form errors on the data object of any 422 server response, when set to a falsy value it will use the data object directly, default: `errors`


**Example**

```javascript
angular.module('app')
.config(function (serverFormProvider) {
  serverFormProvider.logging = true;
  serverFormProvider.errorsKey = 'errors';
});
```

### Methods

#### serialize(form)

* Takes a form controller and returns a form data object.
* If the form controller has a name, the data object's root will be the form name.
* Form controls must not start with `$`

**Params:**

* form : Object (required) - an instance of [NgFormController](https://docs.angularjs.org/api/ng/type/form.FormController)

**Example:**

```javascript
/* Nameless form:
<form>
  <input name="input" ng-model="input"/>
</form>
*/
serverForm.serialize(namelessFormController);
/* Returns:
{
  input: ""
}
*/

/* Named form:
<form name="name">
  <input name="input" ng-model="input"/>
</form>
*/
serverForm.serialize(namedFormController);
/* Returns:
{
  name: {
    input: ""
  }
}
*/
```

#### applyErrors(form, errors)

* Applies errors on the form controller's fields
* If logging is enabled, it'll log a warning when a server error cannot be rendered on the form
* Sets form controls to pristine
* Sets the server $error value to `true`
* Sets the error message on the `$server` value of the form controls to the 

**Params:**

* form : Object (required) - an instance of [NgFormController](https://docs.angularjs.org/api/ng/type/form.FormController)
* errors : Object (required) - object that matches the form's structure, values must be strings, arrays of strings (will be concatenated with `, `), or objects (for nested forms)

**Example:**

```javascript
/* Form:
<form name="name">
  <input name="input" ng-model="input"/>
</form>
*/

/* With errors object that has root */
serverForm.applyErrors(firstFormController, {
  name: {
    input: "cannot be blank"
  }
});

firstFormController.input.$server
// "cannot be blank"

firstFormController.input.$pristine
// true

/* With errors object that has no root */
serverForm.applyErrors(secondFormController, {
  input: "cannot be blank"
});

secondFormController.input.$server
// "cannot be blank"

secondFormController.input.$pristine
// true
```

#### clearErrors(form)

* Sets all `$server` errors on form controller's fields to empty string
* Sets form controller's fields to pristine and validity of server to true

**Params:**

* form : Object (required) - an instance of [NgFormController](https://docs.angularjs.org/api/ng/type/form.FormController)


#### submit(form, config)

* Calls `clearErrors` on form
* Sets $submitting to true, sets $saved to false
* When it finishes submitting it sets $submitting to false
* If resolved succesfully it sets $saved to true, otherwise it's set to false
* If the status code is `422` it will call `applyErrors` on the form with the errors data response

**Params:**

* form : Object (required) - an instance of [NgFormController](https://docs.angularjs.org/api/ng/type/form.FormController)
* config : Object (required) - $http configuration object

**Returns:**

* $http promise object


## Tests

The getting started steps are always the same:

1. Clone the repo
2. Run `npm install`
3. Run `bower install`

After you have the dependencies installed:

* Run unit tests with `npm run unit`
* Run e2e tests with `npm run e2e`
* Run both with `npm test`

