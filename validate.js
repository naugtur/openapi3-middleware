const errorCodes = {
  request_route_error: 'request_route_error',
  request_schema_error: 'request_schema_error'
}
module.exports = {
  validateRequest
}

function getErrorMessage (err) {
  let message = `${err.message} in ${err.meta.in}.`
  if (err.meta.rawErrors) {
    message += ' ' + err.meta.rawErrors.map(e => e.error).join('; ')
  }
  return message
}

function customError ({ code, message, meta }) {
  const err = Error(message)
  err.code = code
  err.meta = meta || {}
  return err
}

function routePathMatchesDefinition (path, pattern) {
  return path.replace(/:/g, "").replace(/\?$/, "") === pattern.replace(/{|}/g, '')
}

function validateRequestAttributes (chow, req) {
  try {
    return chow.validateRequest(req.path, {
      method: req.method,
      query: req.query,
      body: req.body,
      header: req.headers
    })
  } catch (err) {
    const errorMessage = getErrorMessage(err)
    throw customError({
      meta: err.meta,
      message: errorMessage,
      code: errorCodes.request_schema_error
    })
  }
}

function validateRequest ({ req, operationAttributes, chow }) {
  if (!operationAttributes) {
    throw customError({
      meta: {
        code: 500
      },
      message: 'Specified operationId was not found in API definition',
      code: errorCodes.request_route_error
    })
  }
  if (operationAttributes.method.toLowerCase() !== req.method.toLowerCase()) {
    throw customError({
      meta: {
        code: 500
      },
      message: "Route method doesn't match operationId from API definition",
      code: errorCodes.request_route_error
    })
  }
  if (!routePathMatchesDefinition(req.route.path, operationAttributes.path)) {
    throw customError({
      meta: {
        code: 500
      },
      message: "Route path doesn't match operationId from API definition",
      code: errorCodes.request_route_error
    })
  }
  return validateRequestAttributes(chow, req)
}
