const remark = require('remark')
const remarkHTML = require('remark-html')
const is404Regexp = /^\/404/
const isDocsRegexp = /^\/doc/
const trailingSlashRegexp = /\/$/

const alertLandingArray = ['/enterprise']

const markdownProcessor = remark().use(remarkHTML).processSync
function markdownToHtml(input) {
  return markdownProcessor(input).contents
}

const setPageContext = (page, actions) =>
  new Promise(resolve => {
    const pagePath =
      page.path !== '/' && trailingSlashRegexp.test(page.path)
        ? page.path.replace(trailingSlashRegexp, '')
        : page.path

    const isAlertLanding = alertLandingArray.includes(pagePath)

    actions.deletePage(page)
    actions.createPage({
      ...page,
      path: pagePath,
      context: {
        ...page.context,
        is404: is404Regexp.test(page.path),
        isDocs: isDocsRegexp.test(page.path),
        isAlertLanding
      }
    })
    resolve()
  })

exports.setPageContext = setPageContext
exports.markdownToHtml = markdownToHtml
