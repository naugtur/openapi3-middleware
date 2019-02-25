const middleware = require('../index')
const definition = require('./exampleDefinition')
const assert = require('assert')
const validatorInstance = middleware.validator(definition)

describe('validator', () => {
  it('should not throw when called on a correct request', () => {
    validatorInstance.validateRequest({
      path: '/pet/1',
      route: { path: '/pet/:petId' },
      method: 'get',
      query: {}
    }, 'showPetById')
    validatorInstance.validateRequest({
      path: '/pet/1',
      route: { path: '/pet/:petId' },
      method: 'post',
      body: { id: 1, name: 'fafik' },
      headers: {
        'content-type': 'application/json'
      }
    }, 'updatePets')
  })
  it('should throw when used incorrectly', () => {
    assert.throws(() => validatorInstance.validateRequest({
      path: '/pet/1',
      route: { path: '/pet/:petId' },
      method: 'get',
      query: {}
    }, 'not a correct id'))
    assert.throws(() => validatorInstance.validateRequest({
      path: '/pet/1',
      // route:{ path: '/pet/:petId' },
      method: 'post',
      body: { id: 1, name: 'fafik' },
      headers: {
        'content-type': 'application/json'
      }
    }))
    assert.throws(() => validatorInstance.validateRequest({
      path: '/pet/1',
      route: { path: '/pet/:petId' },
      method: 'post',
      body: { id: 1, name: 'fafik' }
      // headers: {
      //   'content-type':'application/json'
      // }
    }))
  })
  it('should throw when request is invalid', () => {
    assert.throws(() => validatorInstance.validateRequest({
      path: '/pet/zzz', // <- not a valid value
      route: { path: '/pet/:petId' },
      method: 'get',
      query: {}
    }, 'not a correct id'))
    assert.throws(() => validatorInstance.validateRequest({
      path: '/pet/1',
      route: { path: '/pet/:petId' },
      method: 'post',
      body: {
        // id: 1,
        name: 'fafik'
      },
      headers: {
        'content-type': 'application/json'
      }
    }))
  })
})
