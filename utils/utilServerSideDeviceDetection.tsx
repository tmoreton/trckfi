export default function (context) {
  const isServer = !!context.req
  const userAgent: string = isServer
    ? context.req.headers['user-agent']
    : navigator.userAgent
  const isLine = /\bLine\//i.test(userAgent) || false
  const isMobile = /(iPad|iPhone|Android|Mobile)/i.test(userAgent) || false
  const rules = [
    'WebView',
    '(iPhone|iPod|iPad)(?!.*Safari/)',
    'Android.*(wv|.0.0.0)'
  ]

  const regex = new RegExp(`(${rules.join('|')})`, 'ig')
  const isInApp = Boolean(userAgent.match(regex))

  return {
    isMobile,
    isLine,
    isInApp,
    userAgent
  }
}