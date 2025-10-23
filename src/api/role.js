import request from "@/utils/request";

// 获取角色选项列表
export function getRoleOptions(params) {
  return request({
    url: "/role/options",
    method: "get",
    params,
  });
}

// 获取角色分页列表
export function getRoleList(params) {
  return request({
    url: "/role/list",
    method: "get",
    params,
  });
}

// 新增角色
export function createRole(data) {
  return request({
    url: "/role",
    method: "post",
    data,
  });
}

// 编辑角色
export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: "put",
    data,
  });
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: "delete",
  });
}

// 修改角色状态
export function updateRoleStatus(id, status) {
  return request({
    url: `/role/${id}/status`,
    method: "put",
    data: { status },
  });
}
