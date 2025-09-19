/* eslint-disable no-unused-vars */
/* ----- plugins ----- */
const os = require('os')
const gulp = require('gulp')
const zip = require('gulp-zip')
const request = require('request')
const fs = require('fs')
const open = require('open')
const path = require('path')
// change appid to choice color
const config = {
  FB_appId: '232051911868878',
  FB_uploadAccessToken: '232051911868878|gvFabpsuIPvN5iuS-mxM481m9cE'
}
/* const config = {
  FB_appId: '347487229332089',
  FB_uploadAccessToken: '347487229332089|tdFmZ-eBVVMbc88Hmix_1WzeOgg'
} */

/* ----- build tasks ----- */

// var exec = require('child_process').exec
// var isDebug = false

// Handle errors
function errorHandler (error) {
  console.log(error)
  this.emit('end')
}

function archive (archivesFolder, filename) {
  return new Promise(function (resolve, reject) {
    console.log(
      'Going to create zip archive: ' + archivesFolder + '/' + filename
    )
    gulp
      .src([
        path.join(__dirname, 'dist/**'),
        '!' + path.join(__dirname, 'dist/archives/**'),
        '!**.zip'
      ])
      .pipe(zip(filename))
      .on('error', reject)
      .pipe(gulp.dest(archivesFolder))
      .on('end', function () {
        console.log('ZIP archive created')
        resolve()
      })
  })
}

function upload (archivesFolder, filename) {
  return new Promise(function (resolve, reject) {
    console.log('Going to upload archive: ' + archivesFolder + '/' + filename)
    const comment =
      process.argv[4] ||
      'Uploaded from ' +
        os.hostname() +
        ' OS: ' +
        os.type() +
        '-' +
        os.platform()

    request.post(
      {
        url: 'https://graph-video.facebook.com/' + config.FB_appId + '/assets',
        formData: {
          access_token: config.FB_uploadAccessToken,
          type: 'BUNDLE',
          comment: comment,
          asset: {
            value: fs.createReadStream(path.resolve(__dirname, archivesFolder, filename)),
            options: {
              filename: filename,
              contentType: 'application/octet-stream'
            }
          }
        }
      },
      function (error, response, body) {
        if (error || !body) reject(error)
        try {
          body = JSON.parse(response.body)
          if (body.success) {
            console.log('Response', JSON.stringify(body))
            console.log('Bundle uploaded via the graph API')
            console.log('Don\'t forget you need to publish the build')
            console.log('Opening developer dashboard...')
            open(
              'https://developers.facebook.com/apps/' +
                config.FB_appId +
                '/instant-games/hosting/'
            )
            resolve()
          } else {
            reject(new Error('Upload failed. Unexpected Graph API response: ' + response.body))
          }
        } catch (e) {
          open(
            'https://developers.facebook.com/apps/' +
              config.FB_appId +
              '/instant-games/hosting/'
          )
          reject(new Error('Upload failed. Invalid response response: ' + response.body))
        }
      }
    )
  })
}

const today = new Date()
const date =
  today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
const time =
  today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds()

gulp.task('push', function (done) {
  const filename = 'Built-game-' + date + ' ' + time + '.zip'
  const archivesFolder = 'dist/archives'
  archive(archivesFolder, filename).then(function () {
    upload(archivesFolder, filename).then(function () {
      console.log('Success!')
      done()
    })
  })
})
