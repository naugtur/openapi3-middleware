# openapi3-middleware
validate requests against your openapi3 definition 

[![npm](https://img.shields.io/npm/v/openapi3-middleware.svg?style=flat)](https://www.npmjs.com/package/openapi3-middleware)

```
npm install openapi3-middleware
```


## Usage

validator checks incoming request as identified by operationId, therefore operationId fields in api definition are required for explicitly matching the right implementation. It's another layer of certainty for your implementation.

```js
const openapi3middleware = require('openapi3-middleware')

const validatorInstance = openapi3middleware.validator(apiDefinition)

// Use directly
validatorInstance.validateRequest(req, operationId) 
  // throws a validation error if anything goes wrong

// Express middleware with default responses
app.get(validatorInstance.expressMiddlewareAutorespond(operationId), handlerFunction)
app.get(validatorInstance.expressMiddlewareAutorespondJson(operationId), handlerFunction)
  // returns a response with a status code matching what happened and a descriptive message to help fix the error

// Express middleware
app.get(validatorInstance.expressMiddleware(operationId), handlerFunction)
  // propagates an error, so custom response can be built in an express error handler
```

### Expected format of req object

If you want to use the validator outside express, you can provide a plain object where `req` is expected. It needs to provide the fields shown below.

```js
req := {
  path: 'string',
  route: { path: 'string' }, // all use of : is removed, the :paramName will be compared with paramName from definition
  method: 'string', // method name, case insensitive match with the API spec
  body: Body, // Whatever you expect as body - probably an object resulting from parsing JSON
  headers: { //headers are optional, but if request has a body, the content-type header must exist and match the key in content field exactly.
  }
}
```


Example:

```js
req = {
  path: '/pet/1',
  route: { path: '/pet/:petId' },
  method: 'post',
  body: { ... },
  headers: {
    'content-type': 'application/json'
  }
}
```

## Contributing

Contributing other framework specific middlewares is more than welcome.

When contributing make sure you run `npm run lint` and don't get any errors nor warnings.
Feel free to consciously add security warning exceptions, we can discuss in the pull request.