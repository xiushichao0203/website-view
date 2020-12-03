import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/admin/auth/login',
    method: 'post',
    data
  })
}

export function registerByUserMail(username, password, userMail) {
  const data = {
    username,
    password,
    userMail
  }
  return request({
    url: '/admin/auth/register',
    method: 'post',
    data
  })
}

export function activateByCheckCode(checkCode) {
  const data = {
    checkCode
  }
  return request({
    url: '/admin/auth/activate',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/admin/auth/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/admin/auth/info',
    method: 'get',
    params: { token }
  })
}

