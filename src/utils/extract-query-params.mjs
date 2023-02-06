
export function extractQueryParams(query) {
  return query.substr(1).split('&').reduce < QueryParams > ((queryParams, param) => {
    const [key, value] = param.split('=')
    queryParams[key] = value
    return queryParams
  }, {})
}
