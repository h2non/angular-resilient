/*! angular-resilient - v0.1 - MIT License - https://github.com/h2non/angular-resilient */
angular.module('ngResilient', [])

  .constant('$$resilient', window.resilient)

  .config(['$$resilient', function (resilient) {
    if (typeof resilient !== 'function') {
      throw new Error('resilient.js is not loaded')
    }
  }])

  .factory('$resilient', ['$http', '$$resilient', '$ResilientProxy',
    function ($http, resilient, ResilientProxy) {
      function proxy(options, cb) {
        $http(options).then(function (res) {
          cb(null, res)
        }, function (err) {
          cb(err)
        })
      }

      function ResilientClient(options) {
        var client = resilient(options)
        client.setHttpClient(proxy)
        return ResilientProxy(client)
      }

      return ResilientClient
    }
  ])

  .factory('$ResilientProxy', ['$q', function ($q) {
    function ResilientProxy(resilient) {
      function handler(defer) {
        return function (err, res) {
          if (err) defer.reject(err)
          else defer.resolve(res)
        }
      }

      function request(options) {
        var defer = $q.defer()
        resilient.send(options, handler(defer))
        return defer.promise
      }

      function normalizeArgs(url, options) {
        if (angular.isObject(url)) {
          options = url
        } else {
          options = angular.isObject(options) ? options : {}
          options.url = url
        }
        return options
      }

      function methodProxy(method) {
        return function (url, options) {
          options = normalizeArgs(url, options)
          options.method = method
          return Resilient(options)
        }
      }

      function Resilient(url, options) {
        return request(normalizeArgs(options))
      }

      Resilient.resilient = resilient
      Resilient.defaults = resilient.defaults
      Resilient.get = methodProxy('get')
      Resilient.post = methodProxy('POST')
      Resilient.put = methodProxy('PUT')
      Resilient.del = methodProxy('DELETE')
      Resilient.patch = methodProxy('PATCH')
      Resilient.head = methodProxy('HEAD')

      return Resilient
    }

    return ResilientProxy
  }])
