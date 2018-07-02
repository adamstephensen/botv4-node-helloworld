var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../botv4-node-hello-world.zip');
var kuduApi = 'https://botv4-node-hello-world.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$botv4-node-hello-world';
var password = 'xmoug2WebwfQlrrQr2XeuLk66cmjhv2sCzl4brM4C7SB4nxXbjPK38uBgBfl';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('botv4-node-hello-world publish');
  } else {
    console.error('failed to publish botv4-node-hello-world', err);
  }
});