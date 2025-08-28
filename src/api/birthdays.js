import request from "@/utils/request";

export function getBirthdayList(params) {
  return request({
    url: "/birthdays/page",
    method: "get",
    params,
  });
}

export function addBirthday(data) {
  console.log("addBirthday data:", data);
  return request({
    url: "/birthdays",
    method: "post",
    data,
  });
}

export function updateBirthday(data) {
  return request({
    url: `/birthdays/${data.id}`,
    method: "put",
    data,
  });
}

export function deleteBirthday(id) {
  return request({
    url: `/birthdays/${id}`,
    method: "delete",
  });
}
