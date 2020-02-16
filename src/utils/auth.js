import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const getDomain = () => {
  if (document.domain === 'localhost') {
    return 'localhost'
  } else {
    const arr = document.domain.split('.').reverse()
    return arr[1] + '.' + arr[0]
  }
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, getDomain(), '/')
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
