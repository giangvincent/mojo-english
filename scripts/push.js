#!/usr/bin/env node
const fs = require('node:fs')
const fsp = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const archiver = require('archiver')
const { fetch, FormData } = require('undici')
const open = require('open')

// Facebook Instant Games config
const config = {
  FB_appId: '232051911868878',
  FB_uploadAccessToken: '232051911868878|gvFabpsuIPvN5iuS-mxM481m9cE'
}

async function ensureDirectory (dir) {
  await fsp.mkdir(dir, { recursive: true })
}

function formatTimestamp () {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}`
}

async function createArchive (distDir, outputDir, filename) {
  await ensureDirectory(outputDir)

  const archivePath = path.join(outputDir, filename)
  const output = fs.createWriteStream(archivePath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve(archivePath))
    output.on('error', reject)
    archive.on('error', reject)

    archive.pipe(output)
    archive.glob('**/*', {
      cwd: distDir,
      ignore: ['archives/**', '*.zip']
    })
    archive.finalize()
  })
}

async function uploadArchive (archivePath, filename, comment) {
  const form = new FormData()
  form.append('access_token', config.FB_uploadAccessToken)
  form.append('type', 'BUNDLE')
  form.append('comment', comment)
  form.append('asset', fs.createReadStream(archivePath), {
    filename,
    contentType: 'application/octet-stream'
  })

  const response = await fetch(`https://graph-video.facebook.com/${config.FB_appId}/assets`, {
    method: 'POST',
    body: form
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Upload failed (${response.status}): ${text}`)
  }

  const body = await response.json()
  if (!body.success) {
    throw new Error(`Upload failed. Unexpected response: ${JSON.stringify(body)}`)
  }

  console.log('Upload response:', JSON.stringify(body))
  console.log('Bundle uploaded via the Graph API')
  console.log("Don't forget you need to publish the build")

  try {
    await open(`https://developers.facebook.com/apps/${config.FB_appId}/instant-games/hosting/`)
  } catch (error) {
    console.warn('Unable to open browser automatically:', error.message)
  }
}

async function run () {
  const distDir = path.resolve(__dirname, '..', 'dist')
  const archivesDir = path.join(distDir, 'archives')

  const timestamp = formatTimestamp()
  const filename = `Built-game-${timestamp}.zip`
  const comment = process.argv[2] || `Uploaded from ${os.hostname()} OS: ${os.type()}-${os.platform()}`

  if (!fs.existsSync(distDir)) {
    throw new Error('dist folder not found. Run "npm run build" first.')
  }

  console.log(`Creating zip archive at ${archivesDir}/${filename}`)
  const archivePath = await createArchive(distDir, archivesDir, filename)
  console.log('ZIP archive created')

  console.log('Uploading archive via Graph API...')
  await uploadArchive(archivePath, filename, comment)
  console.log('Success!')
}

run().catch(error => {
  console.error(error)
  process.exitCode = 1
})
