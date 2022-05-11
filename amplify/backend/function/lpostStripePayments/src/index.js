const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["pubStripeKey","pubStripeSecret"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();
/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_2SIMPLEIOAPP_GRAPHQLAPIIDOUTPUT
	API_2SIMPLEIOAPP_GRAPHQLAPIENDPOINTOUTPUT
	API_2SIMPLEIOAPP_GRAPHQLAPIKEYOUTPUT
	stripeKey
	stripeSecretKey
Amplify Params - DO NOT EDIT */
console.log(Parameters);
exports.handler = async (event) => {
    const response = {
        statusCode: 200,
         headers: {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Headers": "*"
         },
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
