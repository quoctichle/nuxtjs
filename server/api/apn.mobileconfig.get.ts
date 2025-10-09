export default defineEventHandler((event) => {
  const fs = require('fs')
  const path = require('path')

  const filePath = path.resolve('./public/apndocomo.mobileconfig')
  const stream = fs.createReadStream(filePath)

  setHeader(event, 'Content-Type', 'application/x-apple-aspen-config')
  setHeader(event, 'Content-Disposition', 'attachment; filename="apndocomo.mobileconfig"')

  return sendStream(event, stream)
})
