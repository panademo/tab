'use strict';

import {registerUser} from './cognito';
import tfac from './tfac_auth';

const handler = (event) => {

  // Check the received key in here to authenticate the request.
  if (!event.queryStringParameters.id) {
    return Promise.resolve({
      statusCode: 400,
      body: JSON.stringify({ message: 'The id query param must be set to a valid user id' }),
    });
  }

  let tfacId = event.queryStringParameters.id;
  let userEmail = event.queryStringParameters.email;
  let userPassword = 'SomePassword1';

  return new Promise((resolve, reject) => {
    registerUser(
      userEmail, 
      userPassword, 
      (user) => {
        const data = {
          sub: user.sub,
          email: user.email,
          password: userPassword
        };
        tfac.setCognitoCredentials(tfacId, data)
                    .then((response) => {
                      resolve({
                        statusCode: 200,
                        body: JSON.stringify({ message: 'User created.' }),
                      });
                    })
                    .catch((err) => {
                        resolve({
                          statusCode: 400,
                          body: JSON.stringify({ message: 'Error while sending credentials to tfac.', error: err }),
                        });
                    });
      },
      (error) => {
        resolve({
          statusCode: 400,
          body: JSON.stringify({ message: 'An error ocurred while user registration', error: error }),
        });
      });
  });
};

const serverlessHandler = (event, context, callback) => {
  handler(event)
    .then( response => callback(null, response) );
}

module.exports = {
  handler: handler,
  serverlessHandler: serverlessHandler,
}

