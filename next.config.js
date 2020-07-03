const withCSS = require('@zeit/next-css')
, withSass = require('@zeit/next-sass')

module.exports = withSass(withCSS({
  assetPrefix: '.'
}))