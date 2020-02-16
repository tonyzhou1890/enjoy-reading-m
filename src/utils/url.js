import UrlParse from 'url-parse'

export const urlToken = () => {
  return new UrlParse(window.location.href).query.token
}
