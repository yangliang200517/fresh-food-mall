import request from '@/utils/request'

// 获取分类
export const getMember = () => {
  return request.get('/api/member')
}

// 修改管理员等级
export const setMemberGrade = (id, grade) => {
  return request.post('/api/member/grade', {
    id,
    grade
  })
}

// 删除管理员
export const delMember = (id) => {
  return request.post('/api/member/del', {
    id
  })
}

// 添加管理员
export const addMember = (data) => {
  return request.post('/api/member/add', {
    ...data
  })
}
