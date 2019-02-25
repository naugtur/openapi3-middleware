const ChowChow = require('oas3-chow-chow').default
const validate = require('./validate')

module.exports = {
  validator
}

function validator (apiDefinition) {
  const chow = new ChowChow(apiDefinition)

  const paths = apiDefinition.paths
  const operationsMapping = Object.keys(paths).reduce((acc, path) => {
    /* eslint-disable security/detect-object-injection */
    Object.keys(paths[path]).forEach(method => {
      if (!paths[path][method].operationId) {
        throw Error(`operationId missing in ${path} -> ${method} must be defined on each endpoint.`)
      }
      if (acc[paths[path][method].operationId]) {
        throw Error(`operationId ${paths[path][method].operationId} was already defined. you have duplicated operationId values in api definition`)
      }
      acc[paths[path][method].operationId] = {
        method: method,
        path: path
      }
    })
    /* eslint-enable */
    return acc
  }, {})
  // eslint-disable-next-line security/detect-object-injection
  const getMapping = (operationId) => operationsMapping[operationId]

  const middlewareRecipe = (operationId, doStuffWithError) => (req, res, next) => {
    const operationAttributes = getMapping(operationId)
    try {
      validate.validateRequest({ req, operationAttributes, chow })
    } catch (err) {
      return doStuffWithError(err, res, next)
    }
    return next()
  }
  return {
    validateRequest (req, operationId) {
      const operationAttributes = getMapping(operationId)
      return validate.validateRequest({ req, operationAttributes, chow })
    },
    expressMiddleware (operationId) {
      return middlewareRecipe(operationId, (err, res, next) => next(err))
    },
    expressMiddlewareAutorespond (operationId) {
      return middlewareRecipe(operationId, (err, res, next) => res.status(err.meta.code || 400).send(err.message))
    },
    expressMiddlewareAutorespondJson (operationId) {
      return middlewareRecipe(operationId, (err, res, next) => res.status(err.meta.code || 400).json({
        message: err.message,
        code: err.code
      }))
    }
  }
}
