<template>
  <div class="birthday-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-actions">
            <el-input v-model="state.searchForm.name" placeholder="搜索名称..." clearable
              style="width: 200px; margin-right: 10px">
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="queryData">搜索</el-button>
            <el-button type="primary" @click="addClick">添加生日</el-button>
          </div>
        </div>
      </template>

      <el-table :data="state.dataList" style="width: 100%" row-key="id" v-loading="state.loading">
        <el-table-column show-overflow-tooltip prop="name" label="名称" min-width="80" />
        <el-table-column show-overflow-tooltip prop="age" label="年龄" min-width="60" />
        <el-table-column show-overflow-tooltip prop="sex" label="性别" min-width="80">
          <template #default="{ row }">
            <el-tag v-if="row.sex == 0" type="danger">保密</el-tag>
            <el-tag v-else-if="row.sex == 1" type="primary">男</el-tag>
            <el-tag v-else type="success">女</el-tag>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="birthday" label="出生日期" min-width="160" />
        <el-table-column show-overflow-tooltip prop="lunarBirthday" label="出生日期(农历)" min-width="200" />
        <el-table-column show-overflow-tooltip prop="nextBirthday" label="下次生日(公历)" min-width="160" />
        <el-table-column show-overflow-tooltip prop="lunar" label="过农历生日" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.lunar == 1" type="success">是</el-tag>
            <el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remainingDays" label="距离生日" min-width="120">
          <template #default="{ row }">
            <el-tag v-if="row.remainingDays > 0" type="success">还有{{ row.remainingDays }}天</el-tag>
            <el-tag v-else-if="row.remainingDays == 0" type="warning">今天</el-tag>
            <el-tag v-else type="danger">已过{{ -row.remainingDays }}天</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="status" label="状态" min-width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{
              row.status === 1 ? "正常" : "禁用"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reminderDays" label="提前提醒天数" min-width="120">
          <template #default="{ row }">
            <span v-if="row.reminderDays > 0">提前 <span style="color: red;">{{ row.reminderDays }}</span> 天</span>
            <span v-else>不提醒</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="createdAt" label="创建日期" min-width="160" />
        <el-table-column show-overflow-tooltip prop="updatedAt" label="更新日期" min-width="160" />
        <el-table-column fixed="right" label="操作" min-width="100">
          <template #default="{ row }">
            <el-button type="text" @click="editClick(row)">编辑</el-button>
            <el-popconfirm title="确认删除吗?" confirm-button-text="删除" cancel-button-text="取消" @confirm="deleteClick(row)">
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination v-model:current-page="state.currentPage" v-model:page-size="state.pageSize"
          :page-sizes="[10, 20, 50, 100]" :total="state.total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <!-- 添加/编辑项目对话框 -->
    <el-dialog v-model="state.dialogVisible" :title="state.editing ? '编辑生日' : '添加生日'" width="600px">
      <el-form ref="formRef" :model="state.form" :rules="state.rules" label-width="120px">
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="state.form.name" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="state.form.sex" placeholder="请选择性别" style="width: 240px">
            <el-option v-for="item in state.sexOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker v-model="state.form.birthday" type="date" date-format="YYYY-MM-DD" :disabledDate="disabledDate"
            value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择出生日期" />
            &nbsp;<el-text type="warning">请选择公历出生日期</el-text>
        </el-form-item>
        <el-form-item label="是否农历" prop="lunar">
          <el-switch v-model="state.form.lunar" :active-value="1" :inactive-value="2" active-text="农历生日" inactive-text="公历生日" />
        </el-form-item>
        <el-form-item label="提前提醒天数" prop="reminderDays">
          <el-input-number v-model="state.form.reminderDays" min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="state.form.status" :active-value="1" :inactive-value="2" active-text="正常"
            inactive-text="禁用" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="state.saveBtnLoading" @click="saveBirthday"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup type="ts">

import { onMounted, reactive ,ref} from "vue";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import { getBirthdayList,addBirthday,updateBirthday,deleteBirthday } from "@/api/birthdays";

const formRef = ref();
const today = new Date()

const state = reactive({
  searchForm: {
    name: "",
  },
  dataList: [],
  loading: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  dialogVisible: false,
  editing: false,
  saveBtnLoading: false,
  sexOptions: [
    { label: "保密", value: 0 },
    { label: "男", value: 1 },
    { label: "女", value: 2 },
  ],
  form: {
    name: "",
    sex: 0,
    birthday: "",
    lunar: 1,
    reminderDays: 1,
    status: 1,
  },
  rules: {
    name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
    birthday: [{ required: true, message: "请选择出生日期", trigger: "blur" }],
    reminderDays: [{ required: true, message: "请输入提前提醒天数", trigger: "blur" }],
    status: [{ required: true, message: "请选择状态", trigger: "change" }],
  },
});

function addClick() {
  state.dialogVisible = true;
  state.editing = false;
  state.form = {
    name: "",
    sex: 0,
    birthday: "",
    lunar: 1,
    reminderDays: 1,
    status: 1,
  }
  }

function editClick(row) {
  state.dialogVisible = true;
  state.editing = true;
  state.form = { ...row };
}

function deleteClick(row) {
  deleteBirthday(row.id).then((res) => {
    if (res.code === 0) {
      ElMessage.success("删除成功");
      queryData();
    } else {
      ElMessage.error(res.message || "删除失败");
    }
  }).catch(() => {
    ElMessage.error("删除失败");
  });
}

function saveBirthday() {
  if (state.saveBtnLoading) return;
  state.saveBtnLoading = true;
  formRef.value.validate((valid) => {
    if (valid) {
      if (state.editing) {
        updateBirthday(state.form).then((res) => {
          if (res.code === 0) {
            ElMessage.success("更新成功");
            state.dialogVisible = false;
            queryData();
          } else {
            ElMessage.error(res.message || "更新失败");
          }
        }).catch(() => {
          ElMessage.error("更新失败");
        });
      } else {
        const data = { ...state.form };
        addBirthday(data).then((res) => {
          if (res.code === 0) {
            ElMessage.success("添加成功");
            state.dialogVisible = false;
            queryData();
          } else {
            ElMessage.error(res.message || "添加失败");
          }
        }).catch(() => {
          ElMessage.error("添加失败");
        });
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入项");
      return false;
    }
  });
  state.saveBtnLoading = false;
}

function queryData() {
  state.loading = true;
  getBirthdayList({
    name: state.searchForm.name,
    page: state.currentPage,
    size: state.pageSize,
  })
    .then((response) => {
      state.dataList = response.data.list;
      state.total = response.data.total;
    })
    .catch(() => {
      ElMessage.error("获取数据失败");
    })
    .finally(() => {
      state.loading = false;
    });
}

function handleSizeChange(val) {
  state.pageSize = val;
  state.currentPage = 1;
  queryData();
}
function handleCurrentChange(val) {
  state.currentPage = val;
  queryData();
}

function disabledDate(time) {
  // 禁用今天之后的日期
  return time.getTime() > today.setHours(23, 59, 59, 999)
}

onMounted(() => {
  queryData();
});

</script>

<style lang="scss" scoped>
.birthday-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
