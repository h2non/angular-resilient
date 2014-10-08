describe('$resilient', function () {
  var $resilient, $$resilient

  beforeEach(module('ngResilient'))

  beforeEach(inject(function (_$$resilient_, _$resilient_, _$httpBackend_) {
    $resilient = _$resilient_
    $$resilient = _$$resilient_
    $httpBackend = _$httpBackend_
  }))

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
  })

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

    before(function () {
      $httpBackend.when('GET', '/discovery')
        .respond([location.origin +  '/server'])
      $httpBackend.when('GET', '/server')
        .respond({ hello: 'world' })
    })

    after(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    })

    it('should create a client', function () {
      resilient = $resilient({
        discovery: { servers: [location.origin + '/discovery'] }
      })
    })

    it('should perform a request', function (done) {
      resilient.get('/').then(function (res) {
        console.log(res)
        done()
      }, function (err) {
        done(err)
      })
    })
  })
})
