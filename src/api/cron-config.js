import request from "@/utils/request";

/**
 * 获取定时任务配置列表
 */
export function getCronConfigList() {
  return request({
    url: "/cron-config/list",
    method: "get",
  });
}

/**
 * 获取定时任务配置详情
 * @param {number} id - 配置ID
 */
export function getCronConfigDetail(id) {
  return request({
    url: `/cron-config/${id}`,
    method: "get",
  });
}

/**
 * 创建定时任务配置
 * @param {object} data - 任务配置数据
 * @param {string} data.taskName - 任务名称
 * @param {string} data.taskKey - 任务键
 * @param {string} data.cronExpression - Cron表达式
 * @param {string} data.description - 任务描述
 */
export function createCronConfig(data) {
  return request({
    url: "/cron-config",
    method: "post",
    data,
  });
}

/**
 * 更新定时任务配置
 * @param {number} id - 配置ID
 * @param {object} data - 任务配置数据
 * @param {string} data.taskName - 任务名称
 * @param {string} data.cronExpression - Cron表达式
 * @param {string} data.description - 任务描述
 */
export function updateCronConfig(id, data) {
  return request({
    url: `/cron-config/${id}`,
    method: "put",
    data,
  });
}

/**
 * 更新定时任务配置状态
 * @param {object} data - 状态数据
 * @param {number} data.id - 配置ID
 * @param {number} data.status - 状态：1-启用，2-禁用
 */
export function updateCronStatus(data) {
  return request({
    url: "/cron-config/status",
    method: "put",
    data,
  });
}

/**
 * 删除定时任务配置
 * @param {number} id - 配置ID
 */
export function deleteCronConfig(id) {
  return request({
    url: `/cron-config/${id}`,
    method: "delete",
  });
}

/**
 * 重载定时任务
 */
export function reloadCronTasks() {
  return request({
    url: "/cron-config/reload",
    method: "post",
  });
}
