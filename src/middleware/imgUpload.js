'use strict';
const {Storage} = require('@google-cloud/storage');
const fs = require('fs')

const gcs = new Storage({
  projectId: 'steel-lacing-261704',
  keyFilename: '../../steel-lacing-261704-4e9b35bb89e1.json'
});

const bucketName = 'users_profile_pictures'
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let ImgUpload = {};

ImgUpload.uploadToGcs = (req, res, next) => {
  if(!req.file) return next();

  // Can optionally add a path to the gcsname below by concatenating it before the filename
  const gcsname = req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  stream.end(req.file.buffer);
}

module.exports = ImgUpload;

// THE ABOVE IS WHAT YOU CALL A TRUE PROGRAMMER OR EVEN THE BEST PROGRAMMER IN THE WORLD. THIS IS WHAT YOU WANT TO AIM FOR. THIS IS THE KIND OF GUY YOU WANT TO BE LIKE.