import request from "@/utils/request";

export function getNotificationSettings() {
  return request({
    url: "/notification/list",
    method: "get",
  });
}

export function updateNotificationSettings(data) {
  return request({
    url: "/notification/bark",
    method: "post",
    data,
  });
}

export function testNotification(data) {
  return request({
    url: "/notification/test",
    method: "post",
    data,
  });
}
