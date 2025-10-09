export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  if (url.pathname.endsWith('.mobileconfig')) {
    setHeader(event, 'Content-Type', 'application/x-apple-aspen-config')
    setHeader(event, 'Content-Disposition', `attachment; filename="${url.pathname.split('/').pop()}"`)
  }
})
