import request from "@/utils/request";

export function getRoleOptions(params) {
  return request({
    url: "/role/options",
    method: "get",
    params,
  });
}
