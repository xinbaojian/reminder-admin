<template>
  <div class="cron-config-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-actions">
            <el-input
              v-model="state.searchForm.taskName"
              placeholder="搜索任务名称..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="queryData">搜索</el-button>
            <el-button type="primary" @click="addTask">添加任务</el-button>
            <el-button type="success" @click="reloadTasks">重载任务</el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="state.taskList"
        style="width: 100%"
        row-key="id"
        v-loading="state.loading"
      >
        <el-table-column
          show-overflow-tooltip
          prop="taskName"
          label="任务名称"
          min-width="120"
        />
        <el-table-column
          show-overflow-tooltip
          prop="taskKey"
          label="任务键"
          min-width="150"
        />
        <el-table-column
          show-overflow-tooltip
          prop="cronExpression"
          label="Cron表达式"
          min-width="120"
        >
          <template #default="{ row }">
            <el-tooltip :content="getCronDescription(row.cronExpression)" placement="top">
              <span>{{ row.cronExpression }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="description"
          label="任务描述"
          min-width="160"
        />
        <el-table-column prop="status" label="状态" min-width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createdAt"
          label="创建时间"
          min-width="160"
        />
        <el-table-column
          show-overflow-tooltip
          prop="updatedAt"
          label="更新时间"
          min-width="160"
        />
        <el-table-column fixed="right" label="操作" min-width="200">
          <template #default="{ row }">
            <el-button type="text" @click="editTask(row)">编辑</el-button>
            <el-button
              type="text"
              @click="toggleStatus(row)"
              :style="{ color: row.status === 1 ? '#909399' : '#67c23a' }"
            >
              {{ row.status === 1 ? "禁用" : "启用" }}
            </el-button>
            <el-popconfirm
              v-if="!isSystemTask(row.taskKey)"
              title="确认删除该定时任务吗?"
              confirm-button-text="删除"
              cancel-button-text="取消"
              @confirm="deleteTask(row)"
            >
              <template #reference>
                <el-button type="text" style="color: #f56c6c">删除</el-button>
              </template>
            </el-popconfirm>
            <el-tooltip v-else content="系统默认任务不可删除" placement="top">
              <el-button type="text" disabled>删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑任务对话框 -->
    <el-dialog
      v-model="state.dialogVisible"
      :title="state.editing ? '编辑定时任务' : '添加定时任务'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="state.form"
        :rules="state.rules"
        label-width="120px"
      >
        <el-form-item label="任务名称" prop="taskName">
          <el-input
            v-model="state.form.taskName"
            placeholder="请输入任务名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="任务键" prop="taskKey">
          <el-input
            v-model="state.form.taskKey"
            placeholder="请输入任务键（唯一标识）"
            maxlength="100"
            show-word-limit
            :disabled="state.editing"
          />
          <div v-if="state.editing" class="form-tip">
            任务键创建后不可修改
          </div>
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cronExpression">
          <el-input
            v-model="state.form.cronExpression"
            placeholder="请输入Cron表达式"
            maxlength="100"
            show-word-limit
          >
            <template #append>
              <el-button @click="showCronHelp">帮助</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input
            v-model="state.form.description"
            type="textarea"
            placeholder="请输入任务描述"
            maxlength="255"
            show-word-limit
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="state.form.status"
            :active-value="1"
            :inactive-value="2"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTask">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Cron表达式帮助对话框 -->
    <el-dialog
      v-model="state.cronHelpVisible"
      title="Cron表达式帮助"
      width="700px"
    >
      <div class="cron-help">
        <h4>表达式格式</h4>
        <p><code>秒 分 时 日 月 周</code></p>

        <h4>常用示例</h4>
        <el-table :data="cronExamples" border style="width: 100%">
          <el-table-column prop="expression" label="表达式" width="150" />
          <el-table-column prop="description" label="说明" />
        </el-table>

        <h4 style="margin-top: 20px">字段说明</h4>
        <el-table :data="cronFields" border style="width: 100%">
          <el-table-column prop="field" label="字段" width="80" />
          <el-table-column prop="range" label="允许值" width="120" />
          <el-table-column prop="special" label="特殊字符" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { ElForm, ElMessage } from "element-plus";
import {
  getCronConfigList,
  createCronConfig,
  updateCronConfig,
  updateCronStatus,
  deleteCronConfig,
  reloadCronTasks,
} from "@/api/cron-config";

const formRef = ref();

const state = reactive({
  taskList: [],
  loading: false,
  dialogVisible: false,
  cronHelpVisible: false,
  editing: false,
  searchForm: {
    taskName: "",
  },
  form: {
    taskName: "",
    taskKey: "",
    cronExpression: "",
    description: "",
    status: 1,
  },
  rules: {
    taskName: [
      { required: true, message: "请输入任务名称", trigger: "blur" },
      { max: 100, message: "任务名称不能超过100个字符", trigger: "blur" },
    ],
    taskKey: [
      { required: true, message: "请输入任务键", trigger: "blur" },
      { max: 100, message: "任务键不能超过100个字符", trigger: "blur" },
      {
        pattern: /^[a-zA-Z0-9_]+$/,
        message: "任务键只能包含字母、数字和下划线",
        trigger: "blur",
      },
    ],
    cronExpression: [
      { required: true, message: "请输入Cron表达式", trigger: "blur" },
      { max: 100, message: "Cron表达式不能超过100个字符", trigger: "blur" },
      { validator: validateCronExpression, trigger: "blur" },
    ],
    description: [
      { max: 255, message: "任务描述不能超过255个字符", trigger: "blur" },
    ],
  },
});

// Cron表达式示例
const cronExamples = [
  { expression: "0 0 7 * * *", description: "每天早上7点执行" },
  { expression: "0 30 8 * * *", description: "每天早上8点30分执行" },
  { expression: "0 0 9 * * 1-5", description: "周一到周五早上9点执行" },
  { expression: "0 0 */2 * * *", description: "每2小时执行一次" },
  { expression: "0 0 0 * * *", description: "每天凌晨执行" },
];

// Cron字段说明
const cronFields = [
  { field: "秒", range: "0-59", special: "* / , -" },
  { field: "分", range: "0-59", special: "* / , -" },
  { field: "时", range: "0-23", special: "* / , -" },
  { field: "日", range: "1-31", special: "* / , - ?" },
  { field: "月", range: "1-12", special: "* / , -" },
  { field: "周", range: "0-6（0为周日）", special: "* / , - ?" },
];

// 验证 Cron 表达式格式
function validateCronExpression(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }

  const parts = value.trim().split(/\s+/);
  
  // Cron 表达式必须包含 5 或 6 个字段
  if (parts.length !== 5 && parts.length !== 6) {
    callback(new Error("Cron表达式格式错误，应包含5个字段（分 时 日 月 周）或6个字段（秒 分 时 日 月 周）"));
    return;
  }

  // 定义各字段的取值范围
  const ranges = {
    second: { min: 0, max: 59, name: "秒" },
    minute: { min: 0, max: 59, name: "分" },
    hour: { min: 0, max: 23, name: "时" },
    day: { min: 1, max: 31, name: "日" },
    month: { min: 1, max: 12, name: "月" },
    week: { min: 0, max: 6, name: "周" },
  };

  // 根据字段数量确定各字段的含义
  const fields = parts.length === 6 
    ? ["second", "minute", "hour", "day", "month", "week"]
    : ["minute", "hour", "day", "month", "week"];

  // 验证每个字段
  for (let i = 0; i < parts.length; i++) {
    const field = fields[i];
    const range = ranges[field];
    const part = parts[i];

    if (!validateCronField(part, range.min, range.max, field === "day" || field === "week")) {
      callback(new Error(`${range.name}字段格式错误：${part}。允许值范围 ${range.min}-${range.max}，支持特殊字符 * / , - ${field === "day" || field === "week" ? "?" : ""}`));
      return;
    }
  }

  callback();
}

// 验证单个 Cron 字段
function validateCronField(value, min, max, allowQuestionMark = false) {
  // 允许的特殊字符
  const specialChars = allowQuestionMark ? /^[*?,\-/\d]+$/ : /^[*\-,/\d]+$/;
  
  // 检查是否包含非法字符
  if (!specialChars.test(value)) {
    return false;
  }

  // 如果是 * 或 ?，直接返回 true
  if (value === "*" || value === "?") {
    return true;
  }

  // 处理逗号分隔的多个值
  if (value.includes(",")) {
    const items = value.split(",");
    return items.every(item => validateCronField(item, min, max, allowQuestionMark));
  }

  // 处理连字符范围
  if (value.includes("-")) {
    const parts = value.split("-");
    if (parts.length !== 2) return false;
    const start = parseInt(parts[0]);
    const end = parseInt(parts[1]);
    return !isNaN(start) && !isNaN(end) && start >= min && start <= max && end >= min && end <= max && start <= end;
  }

  // 处理斜杠步长
  if (value.includes("/")) {
    const parts = value.split("/");
    if (parts.length !== 2) return false;
    const base = parts[0];
    const step = parseInt(parts[1]);
    
    if (isNaN(step) || step <= 0) return false;
    
    if (base === "*") {
      return true;
    }
    
    const start = parseInt(base);
    return !isNaN(start) && start >= min && start <= max;
  }

  // 单个数字
  const num = parseInt(value);
  return !isNaN(num) && num >= min && num <= max;
}

// 判断是否为系统任务
function isSystemTask(taskKey) {
  return taskKey === "check_subscriptions" || taskKey === "check_birthdays";
}

// 获取Cron表达式的描述
function getCronDescription(expression) {
  const example = cronExamples.find((e) => e.expression === expression);
  return example ? example.description : "自定义Cron表达式";
}

// 查询数据
function queryData() {
  state.loading = true;
  getCronConfigList()
    .then((res) => {
      if (res.code === 0) {
        let list = res.data.list || [];
        // 如果有搜索条件，进行过滤
        if (state.searchForm.taskName) {
          list = list.filter((item) =>
            item.taskName.includes(state.searchForm.taskName)
          );
        }
        state.taskList = list;
      } else {
        ElMessage.error(res.message || "获取定时任务列表失败");
      }
    })
    .finally(() => {
      state.loading = false;
    });
}

// 添加任务
function addTask() {
  state.dialogVisible = true;
  state.editing = false;
  state.form = {
    taskName: "",
    taskKey: "",
    cronExpression: "",
    description: "",
    status: 1,
  };
}

// 编辑任务
function editTask(row) {
  state.dialogVisible = true;
  state.editing = true;
  state.form = { ...row };
}

// 保存任务
function saveTask() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiCall = state.editing
        ? updateCronConfig(state.form.id, state.form)
        : createCronConfig(state.form);

      apiCall
        .then((res) => {
          if (res.code === 0) {
            ElMessage.success(state.editing ? "任务更新成功" : "任务创建成功");
            state.dialogVisible = false;
            queryData();
          } else {
            ElMessage.error(res.message || "操作失败");
          }
        })
        .catch((error) => {
          ElMessage.error("操作失败，请稍后重试");
        });
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
}

// 切换状态
function toggleStatus(row) {
  const newStatus = row.status === 1 ? 2 : 1;
  updateCronStatus({ id: row.id, status: newStatus })
    .then((res) => {
      if (res.code === 0) {
        ElMessage.success("状态更新成功");
        queryData();
      } else {
        ElMessage.error(res.message || "状态更新失败");
      }
    })
    .catch((error) => {
      ElMessage.error("状态更新失败，请稍后重试");
    });
}

// 删除任务
function deleteTask(row) {
  deleteCronConfig(row.id)
    .then((res) => {
      if (res.code === 0) {
        ElMessage.success("删除成功");
        queryData();
      } else {
        ElMessage.error(res.message || "删除失败");
      }
    })
    .catch((error) => {
      ElMessage.error("删除失败，请稍后重试");
    });
}

// 重载任务
function reloadTasks() {
  reloadCronTasks()
    .then((res) => {
      if (res.code === 0) {
        ElMessage.success("任务重载成功");
      } else {
        ElMessage.error(res.message || "任务重载失败");
      }
    })
    .catch((error) => {
      ElMessage.error("任务重载失败，请稍后重试");
    });
}

// 显示Cron帮助
function showCronHelp() {
  state.cronHelpVisible = true;
}

onMounted(() => {
  queryData();
});
</script>

<style lang="scss" scoped>
.cron-config-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }

  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
  }

  .cron-help {
    h4 {
      margin: 10px 0;
      font-size: 16px;
      font-weight: 600;
    }

    p {
      margin: 10px 0;
      font-family: monospace;
      background: #f5f7fa;
      padding: 8px 12px;
      border-radius: 4px;
    }

    code {
      background: #f5f7fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
  }
}
</style>
