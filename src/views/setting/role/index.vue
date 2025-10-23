<template>
  <div class="role-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-actions">
            <el-input
              v-model="state.searchForm.name"
              placeholder="搜索角色名称..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-input
              v-model="state.searchForm.code"
              placeholder="搜索角色编码..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-select
              v-model="state.searchForm.status"
              placeholder="状态"
              clearable
              style="width: 150px; margin-right: 10px"
            >
              <el-option label="正常" :value="1" />
              <el-option label="禁用" :value="2" />
            </el-select>
            <el-button type="primary" @click="queryData">搜索</el-button>
            <el-button type="primary" @click="addClick">添加角色</el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="state.dataList"
        style="width: 100%"
        row-key="id"
        v-loading="state.loading"
      >
        <el-table-column prop="name" label="角色名称" min-width="120" />
        <el-table-column prop="code" label="角色编码" min-width="120" />
        <el-table-column prop="sort" label="排序" min-width="80" />
        <el-table-column prop="description" label="角色描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="2"
              active-text="正常"
              inactive-text="禁用"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建日期" min-width="160" />
        <el-table-column prop="updatedAt" label="更新日期" min-width="160" />
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="{ row }">
            <el-button type="text" @click="editClick(row)">编辑</el-button>
            <el-popconfirm
              title="确认删除吗?"
              confirm-button-text="删除"
              cancel-button-text="取消"
              @confirm="deleteClick(row)"
            >
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="state.currentPage"
          v-model:page-size="state.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="state.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      v-model="state.dialogVisible"
      :title="state.editing ? '编辑角色' : '添加角色'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="state.form"
        :rules="state.rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="state.form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="state.form.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="state.form.sort"
            :min="0"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="state.form.status"
            :active-value="1"
            :inactive-value="2"
            active-text="正常"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="state.form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRole">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup type="ts">
import { Search } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  getRoleList,
  createRole,
  updateRole,
  deleteRole,
  updateRoleStatus,
} from "@/api/role";

const formRef = ref();

const state = reactive({
  dataList: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  searchForm: {
    name: "",
    code: "",
    status: undefined,
  },
  loading: false,
  dialogVisible: false,
  editing: false,
  form: {
    name: "",
    code: "",
    sort: 0,
    description: "",
    status: 1,
  },
  rules: {
    name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
    sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
    status: [{ required: true, message: "请选择状态", trigger: "change" }],
  },
});

function handleSizeChange(val) {
  state.pageSize = val;
  state.currentPage = 1;
  queryData();
}

function handleCurrentChange(val) {
  state.currentPage = val;
  queryData();
}

function queryData() {
  state.loading = true;
  getRoleList({
    pageNum: state.currentPage,
    pageSize: state.pageSize,
    name: state.searchForm.name,
    code: state.searchForm.code,
    status: state.searchForm.status,
  })
    .then((res) => {
      if (res.code === 0) {
        state.dataList = res.data.list;
        state.total = res.data.total;
      } else {
        ElMessage.error(res.message || "查询失败");
      }
    })
    .finally(() => {
      state.loading = false;
    });
}

function saveRole() {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiCall = state.editing
        ? updateRole(state.form.id, state.form)
        : createRole(state.form);

      apiCall.then((res) => {
        if (res.code === 0) {
          ElMessage.success(state.editing ? "编辑成功" : "添加成功");
          state.dialogVisible = false;
          queryData();
        } else {
          ElMessage.error(res.message || "操作失败");
        }
      });
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
}

function addClick() {
  state.dialogVisible = true;
  state.editing = false;
  state.form = {
    name: "",
    code: "",
    sort: 0,
    description: "",
    status: 1,
  };
}

function editClick(item) {
  state.dialogVisible = true;
  state.editing = true;
  state.form = { ...item };
}

function deleteClick(row) {
  deleteRole(row.id).then((res) => {
    if (res.code === 0) {
      ElMessage.success("删除成功");
      queryData();
    } else {
      ElMessage.error(res.message || "删除失败");
    }
  });
}

function handleStatusChange(row) {
  const statusText = row.status === 1 ? '启用' : '禁用';
  updateRoleStatus(row.id, row.status)
    .then((res) => {
      if (res.code === 0) {
        ElMessage.success(`${statusText}成功`);
        queryData();
      } else {
        // 接口返回不成功，恢复状态
        row.status = row.status === 1 ? 2 : 1;
        ElMessage.error(res.message || `${statusText}失败`);
      }
    })
    .catch((error) => {
      // 请求失败，恢复状态
      row.status = row.status === 1 ? 2 : 1;
      ElMessage.error(`${statusText}失败`);
    });
}

onMounted(() => {
  queryData();
});
</script>

<style lang="scss" scoped>
.role-container {
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
