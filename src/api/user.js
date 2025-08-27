import request from "@/utils/request";
import { tokenName } from "@/config";

export async function login(data) {
  return request({
    url: "/login",
    method: "post",
    data,
  });
}

export function getUserInfo(accessToken) {
  return request({
    url: "/userInfo",
    method: "get",
    data: {
      [tokenName]: accessToken,
    },
  });
}

export function logout() {
  return request({
    url: "/logout",
    method: "post",
  });
}

export function register() {
  return request({
    url: "/register",
    method: "post",
  });
}

export function getUserList(params) {
  return request({
    url: "/user/page",
    method: "get",
    params,
  });
}

export function createUser(data) {
  return request({
    url: "/user",
    method: "post",
    data,
  });
}

export function updateUser(data) {
  return request({
    url: `/user/${data.id}`,
    method: "put",
    data,
  });
}

export function deleteUser(id) {
  return request({
    url: `/user/${id}`,
    method: "delete",
  });
}
