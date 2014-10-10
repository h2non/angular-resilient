describe('$resilient', function () {
  var $resilient, $$resilient

  function proxy(options, cb) {
    cb(null, { status: 200 })
  }

  beforeEach(module('ngResilient'))

  beforeEach(inject(function (_$$resilient_, _$resilient_) {
    $resilient = _$resilient_
    $$resilient = _$$resilient_
  }))

  describe('API', function () {
    it('should expose the resilient API', function () {
      expect($$resilient).to.be.an('function')
    })

    it('should expose the library version', function () {
      expect($$resilient.VERSION).to.be.a('string')
    })

    it('should expose the main constructor', function () {
      expect($resilient).to.be.an('function')
    })
  })

  describe('create client with discovery options', function () {
    var resilient = null

    it('should create a client', function () {
      resilient = $resilient({
        service: { servers: [ location.origin + '/server' ] }
      })
      resilient.resilient.setHttpClient(proxy)
    })

    it('should perform GET request', function () {
      resilient.get('/test')
    })

    it('should perform a POST request', function () {
      resilient.post('/test')
    })

    it('should perform a PUT request', function () {
      resilient.put('/test')
    })

    it('should perform a DELETE request', function () {
      resilient.delete('/test')
    })

    it('should perform a PATCH request', function () {
      resilient.patch('/test')
    })

    it('should perform a HEAD request', function () {
      resilient.head('/test')
    })
  })

})
