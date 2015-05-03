/*! angular-resilient - v0.3.0 - MIT License - https://github.com/h2non/angular-resilient */
angular.module('ngResilient', [])

  .constant('$$resilient', window.resilient)

  .config(['$$resilient', function (resilient) {
    if (typeof resilient !== 'function') {
      throw new Error('resilient.js is not available in the global scope')
    }
  }])

  .factory('$resilient', ['$http', '$$resilient', '$ResilientProxy',
    function ($http, resilient, ResilientProxy) {
      function proxy(options, cb) {
        $http(options).then(function (res) {
          cb(null, normalizeHeaders(res))
        }).catch(function (err) {
          cb(normalizeHeaders(err))
        })
      }

      function normalizeHeaders(res) {
        if (res && typeof res.headers === 'function') {
          res.$$headers = res.headers
          res.headers = res.headers()
        }
        return res
      }

      function ResilientClient(options) {
        var client = resilient(options)
        client.useHttpClient(proxy)
        return ResilientProxy(client)
      }

      return ResilientClient
    }
  ])

  .factory('$ResilientProxy', ['$q', function ($q) {
    function ResilientProxy(resilient) {
      function handler(defer) {
        return function (err, res) {
          if (err) defer.reject(restoreHeaders(err))
          else defer.resolve(restoreHeaders(res))
        }
      }

      function restoreHeaders(res) {
        if (res && typeof res.$$headers === 'function') {
          res.headers = res.$$headers
          res.$$headers = undefined
        }
        return res
      }

      function request(options) {
        var defer = $q.defer()
        resilient.send(options, handler(defer))
        return defer.promise
      }

      function normalizeArgs(path, options) {
        if (angular.isObject(path)) {
          options = path
        } else {
          options = angular.isObject(options) ? options : {}
          options.path = path
        }
        return options
      }

      function methodProxy(method) {
        return function (path, options) {
          options = normalizeArgs(path, options)
          options.method = method
          return Resilient(options)
        }
      }

      function Resilient(path, options) {
        return request(normalizeArgs(path, options))
      }

      Resilient.resilient = resilient
      Resilient.defaults = resilient.defaults
      Resilient.VERSION = resilient.VERSION
      Resilient.get = methodProxy('GET')
      Resilient.post = methodProxy('POST')
      Resilient.put = methodProxy('PUT')
      Resilient.delete = methodProxy('DELETE')
      Resilient.patch = methodProxy('PATCH')
      Resilient.head = methodProxy('HEAD')
      Resilient.use = angular.bind(resilient, resilient.use)

      return Resilient
    }

    return ResilientProxy
  }])
