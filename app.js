/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

var AWS = require('ibm-cos-sdk');
var util = require('util');
var cors = require('cors')
var bodyParser = require('body-parser');

// get the app environment from Cloud Foundry
const appEnv = cfenv.getAppEnv();
const cosService = 'cloud-object-storage';

// get the app environment from Cloud Foundry
var cosCreds = appEnv.services[cosService][0].credentials;

var config = {
//    endpoint: 's3.us-south.cloud-object-storage.appdomain.cloud',
    endpoint: 's3.private.us-south.cloud-object-storage.appdomain.cloud',
    apiKeyId: cosCreds.apikey,
    ibmAuthEndpoint: 'https://iam.ng.bluemix.net/oidc/token',
    serviceInstanceId: cosCreds.resource_instance_id
};

console.log(`apikeyid: ${cosCreds.apikey} serviceInstanceId: ${cosCreds.resource_instance_id}`)

var cos = new AWS.S3(config);

//------------------------------------------------------------------------------
var mybucket = 'cos-test-cfee';
var num = 1;
var myfile = 'cos-text' + num;
var filecontent = 'this is a ' + myfile;
//------------------------------------------------------------------------------

// createBucket('mt-test1');
// createTextFile(mybucket, myfile, filecontent)
// getBucketContents(mybucket)

function getBucketContents() {
  console.log('Listing Objects');
  return cos.listObjects({
      Bucket: mybucket
  }).promise();
}

function doCreateBucket() {
    console.log('Creating bucket');
    return cos.createBucket({
        Bucket: mybucket,
        CreateBucketConfiguration: {
          LocationConstraint: 'us-south-standard'
        },
    }).promise();
}
function doCreateObject() {
    console.log('Creating object');
    return cos.putObject({
        Bucket: mybucket,
        Key: myfile,
        Body: filecontent
    }).promise();
}

function doDeleteObject() {
    console.log('Deleting object');
    return cos.deleteObject({
        Bucket: mybucket,
        Key: myfile
    }).promise();
}

function doDeleteBucket() {
    console.log('Deleting bucket');
    return cos.deleteBucket({
        Bucket: mybucket
    }).promise();
}

/* doCreateObject()
    .then(function() {
        console.log('Finished!');
    })
    .catch(function(err) {
        console.error('An error occurred:');
        console.error(util.inspect(err));
    });
*/    

// create a new express server
var app = express();
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/setting', function(req, res) {
  console.log(req.body);
    //set params in this server
    mybucket = req.body.mybucket;
    num = req.body.num;
    myfile = req.body.myfile;
    filecontent = req.body.filecontent;
  res.send(req.body)
})

app.get('/list', function(req, res) {
  getBucketContents(mybucket)
  .then(function(data) {
      res.send(data)
  })
  .then(doCreateObject)
  .catch(function(err) {
      console.error('An error occurred:');
      res.send(err);
  });
})

// start server on the specified port and binding host
app.listen(appEnv.port, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
