import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/manage/suser/v1/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/manage/suser/v1/user/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/manage/suser/v1/user/logout',
    method: 'post'
  })
}

export function fetchList(query) {
  return request({
    url: '/api/manage/suser/v1/user/getUserPage',
    method: 'post',
    data: query
  })
}
