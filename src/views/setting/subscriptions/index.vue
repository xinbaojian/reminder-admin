<template>
  <div class="project-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-actions">
            <el-input
              v-model="state.searchForm.name"
              placeholder="搜索订阅..."
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
            <el-button type="primary" @click="addClick">添加订阅</el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="state.dataList"
        style="width: 100%"
        row-key="id"
        v-loading="state.loading"
      >
        <el-table-column show-overflow-tooltip prop="name" label="订阅名称" min-width="120" />
        <el-table-column show-overflow-tooltip prop="type" label="类型" min-width="120" />
        <el-table-column show-overflow-tooltip prop="remainingDays" label="剩余天数" min-width="80" />
        <el-table-column show-overflow-tooltip prop="status" label="状态" min-width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{
              row.status === 1 ? "正常" : "禁用"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="reminderDays"
          label="提前提醒天数"
          min-width="120"
        />
        <el-table-column show-overflow-tooltip prop="startTime" label="开始时间" min-width="160" />
        <el-table-column show-overflow-tooltip prop="endTime" label="结束时间" min-width="160" />
        <el-table-column show-overflow-tooltip prop="description" label="描述" min-width="160" />
        <el-table-column show-overflow-tooltip prop="createdAt" label="创建日期" min-width="160" />
        <el-table-column show-overflow-tooltip prop="updatedAt" label="更新日期" min-width="160" />
        <el-table-column fixed="right" label="操作" min-width="100">
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

    <!-- 添加/编辑项目对话框 -->
    <el-dialog
      v-model="state.dialogVisible"
      :title="state.editing ? '编辑订阅' : '添加订阅'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="state.form"
        :rules="state.rules"
        label-width="120px"
      >
        <el-form-item label="订阅名称" prop="name">
          <el-input v-model="state.form.name" />
        </el-form-item>
        <el-form-item label="订阅类型" prop="type">
          <el-input v-model="state.form.type" />
        </el-form-item>
        <el-form-item label="提前提醒天数" prop="reminderDays">
          <el-input-number
            v-model="state.form.reminderDays"
            min="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="state.form.startTime"
            type="datetime"
            date-format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="state.form.endTime"
            type="datetime"
            date-format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择结束时间"
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
        <el-form-item label="描述" prop="description">
          <el-input v-model="state.form.description" type="textarea" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveSubscription"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script type="ts" setup>
import { Search } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { ElForm, ElMessage } from "element-plus";
import { getSubscriptionList,addSubscription ,editSubscription,deleteSubscription} from "@/api/subscriptions";

const formRef = ref();

const state = reactive({
  dataList: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  searchForm: {
    name: '',
  },
  loading: false,
  dialogVisible: false,
  editing: false,
  form: {
      name: '',
      type: '',
      status: 1,
      startTime: '',
      endTime: '',
      reminderDays: 1,
      description: ''
  },
  rules: {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    type: [{ required: true, message: "请输入类型", trigger: "blur" }],
    startTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
    endTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
    reminderDays: [{ required: true, message: "请输入提前提醒天数", trigger: "blur" }],
  },
})

function handleSizeChange(val) {
  state.pageSize = val;
  state.currentPage = 1;
  queryData();
}
function handleCurrentChange(val) {
  state.currentPage = val;
  queryData();
}

function queryData(){
  getSubscriptionList({
    page: state.currentPage,
    size: state.pageSize,
    name: state.searchForm.name
  }).then(res => {
    if (res.code === 0) {
      state.dataList = res.data.list;
      state.total = res.data.total;
    } else {
      ElMessage.error(res.message);
    }
  });
}

function saveSubscription() {
  formRef.value.validate().then(() => {
    const apiCall = state.editing
      ? editSubscription(state.form.id, state.form)
      : addSubscription(state.form);

    apiCall.then(res => {
      if (res.code === 0) {
        ElMessage.success("操作成功");
        state.dialogVisible = false;
        queryData();
      } else {
        ElMessage.error(res.message);
      }
    });
  });
}

function addClick(){
  state.dialogVisible = true;
  state.editing = false;
  state.form = {
    name: '',
    type: '',
    status: 1,
    startTime: '',
    endTime: '',
    reminderDays: 1,
    description: ''
  };
}

function editClick(item) {
  state.dialogVisible = true;
  state.editing = true;
  state.form = { ...item };
}

function deleteClick(row) {
  // 调用删除接口
  deleteSubscription(row.id).then(res => {
    if (res.code === 0) {
      ElMessage.success("删除成功");
      queryData();
    } else {
      ElMessage.error(res.message);
    }
  });
}

onMounted(() => {
  queryData();
});
</script>

<style lang="scss" scoped>
.project-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }

  .project-name {
    display: flex;
    align-items: center;
  }

  .project-description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .project-avatar-detail {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: white;
    margin: 0 auto;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
