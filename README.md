# angular-resilient [![Build Status](https://api.travis-ci.org/h2non/angular-resilient.svg?branch=master)][travis] [![Code Climate](https://codeclimate.com/github/h2non/angular-resilient/badges/gpa.svg)](https://codeclimate.com/github/h2non/angular-resilient)

Make [$http](https://docs.angularjs.org/api/ng/service/$http) resilient. 
This is a simple [AngularJS](http://angularjs.org) service wrapper of the [Resilient](http://resilient-http.github.io) HTTP client that allows you to use all the `$http` features, such as interceptors, caching, config options, mocking... but turning it into a failover, client-side balanced and powerful HTTP client

For further information about Resilient and how it works, see the [project page](http://resilient-http.github.io) and the [JavaScript library](https://github.com/resilient-http/resilient.js)

It works with Angular >= 1.0

## Installation

Via [Bower](http://bower.io)
```bash
bower install angular-resilient
```

Via [Component](http://component.io/)
```bash
component install h2non/angular-resilient
```

Or loading the script remotely
```html
<script src="//cdn.rawgit.com/h2non/angular-resilient/0.2.1/angular-resilient.js"></script>
```

### Environments

- Chrome >= 5
- Firefox >= 3
- Safari >= 5
- Opera >= 10
- IE >= 8

### Setup

Load the module as dependency of your application
```js
var app = angular.module('app', ['ngResilient'])
```

### Services

#### $resilient

Main service to creating new Resilient HTTP clients

```js
app.factory('ResilientService', function ($resilient) {
  return $resilient({
    service: {
      basePath: '/api/1.0'
    },
    discovery: {
      servers: ['http://discover.api.me', 'http://discover.api.me']
    }
  })
})
```

Consuming the Resilient client
```js
app.controller('ProfileCtrl', function (ResilientService) {
  ResilientService.get('/user').then(function (res) {
    // ...
  }, function (err) {
    // ...
  })
})
```

## API

For full featured API, please see the library [documentation](https://github.com/resilient-http/resilient.js)

Options param should be a valid $http [options compatible](https://docs.angularjs.org/api/ng/service/$http#usage) object

### $resilient([ options ])

`options` params should be a valid [Resilient options](https://github.com/resilient-http/resilient.js#options) object

#### $resilient#get(path [, options])
Return: `promise`

#### $resilient#post(path [, options])
Return: `promise`

#### $resilient#put(path [, options])
Return: `promise`

#### $resilient#delete(path [, options])
Return: `promise`

#### $resilient#patch(path [, options])
Return: `promise`

#### $resilient#head(path [, options])
Return: `promise`

#### $resilient.resilient
Type: `Resilient`

Expose the `Resilient` [API](https://github.com/resilient-http/resilient.js#api)

#### $resilient#defaults
Type: `object`

Default `Resilient` client options

## Contributing

Wanna help? Cool! It will be appreciated :)

You must add new test cases for any new feature or refactor you do,
always following the same design/code patterns that already exist

### Development

Only [node.js](http://nodejs.org) is required for development

Clone the repository
```bash
$ git clone https://github.com/h2non/angular-resilient.git && cd angular-resilient
```

Install dependencies
```bash
$ npm install
```
```bash
$ bower install
```

Generate browser bundle source
```bash
$ make browser
```

Run tests
```bash
$ make test
```

## License

[MIT](http://opensource.org/licenses/MIT) © Tomas Aparicio

[travis]: http://travis-ci.org/h2non/angular-resilient
