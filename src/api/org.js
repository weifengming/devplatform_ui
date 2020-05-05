import request from '@/utils/request'

export function jsonParentsOrgTree() {
  return request({
    url: '/api/manage/sorg/v1/org/jsonParentsOrgTree',
    method: 'get'
  })
}

export function jsonOrgTreeByParentId(params) {
  return request({
    url: '/api/manage/sorg/v1/org/jsonOrgTreeByParentId',
    method: 'get',
    params: { parentId: params }
  })
}
