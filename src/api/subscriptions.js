import request from "@/utils/request";

export function getSubscriptionList(params) {
  return request({
    url: "/subscriptions/page",
    method: "get",
    params,
  });
}

export function addSubscription(data) {
  return request({
    url: "/subscriptions",
    method: "post",
    data,
  });
}

export function editSubscription(id, data) {
  return request({
    url: `/subscriptions/${id}`,
    method: "put",
    data,
  });
}

export function deleteSubscription(id) {
  return request({
    url: `/subscriptions/${id}`,
    method: "delete",
  });
}

export function recalculateSubscriptions() {
  return request({
    url: `/subscriptions/recalculate`,
    method: "get",
  });
}
