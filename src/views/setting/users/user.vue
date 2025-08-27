<template>
  <div class="project-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-actions">
            <el-input
              v-model="state.searchForm.username"
              placeholder="搜索用户..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="getUserPage">搜索</el-button>
            <el-button type="primary" @click="addUser">添加用户</el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="state.userList"
        style="width: 100%"
        row-key="id"
        v-loading="state.loading"
      >
        <el-table-column prop="username" label="用户名称" min-width="200" />
        <el-table-column prop="email" label="邮箱" min-width="120" />
        <el-table-column prop="status" label="状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{
              row.status === 1 ? "正常" : "禁用"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建日期" min-width="160" />
        <el-table-column prop="updatedAt" label="更新日期" min-width="160" />
        <el-table-column fixed="right" label="操作" min-width="100">
          <template #default="{ row }">
            <el-button type="text" @click="editUser(row)">编辑</el-button>
            <el-popconfirm title="确认删除吗?" confirm-button-text="删除" cancel-button-text="取消" @confirm="deleteUserClick(row)">
              <template #reference>
                <el-button type="text"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
            <el-button type="text" @click="showPasswordDialog(row)">更新密码</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="state.currentPage"
          v-model:page-size="state.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="state.totalUser"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑项目对话框 -->
    <el-dialog
      v-model="state.userDialogVisible"
      :title="state.editingUser ? '编辑用户' : '添加用户'"
      width="600px"
    >
      <el-form
        ref="userFormRef"
        :model="state.userForm"
        :rules="state.userRules"
        label-width="100px"
      >
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="state.userForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="state.userForm.email" />
        </el-form-item>
        <el-form-item v-if="!state.editingUser" label="密码" prop="password">
          <el-input v-model="state.userForm.password" type="password" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="state.userForm.status"
            :active-value="1"
            :inactive-value="2"
            active-text="正常"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.userDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
    <!--更新密码-->
    <el-dialog
      v-model="state.passwordDialogVisible"
      title="更新密码"
      width="400px"
    >
      <el-form
        ref="passwordFormRef"
        :model="state.passwordForm"
        :rules="state.passwordRules"
        label-width="100px"
      >
        <el-form-item label="新密码" prop="pwd">
          <el-input v-model="state.passwordForm.pwd" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="newPwd">
          <el-input v-model="state.passwordForm.newPwd" type="password" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closePasswordDialog()">取消</el-button>
          <el-button type="primary" @click="updatePasswordClick()"> 更新 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup type="ts">
import { Search } from "@element-plus/icons-vue";
import { getUserList ,createUser, updateUser, deleteUser,updatePassword} from "@/api/user";
import { onMounted, reactive, ref } from "vue";
import { ElForm, ElMessage } from "element-plus";

const userFormRef = ref();
const passwordFormRef = ref();

const state = reactive({
  userList: [],
  totalUser: 0,
  currentPage: 1,
  pageSize: 10,
  searchForm: {
    username: '',
  },
  loading: false,
  userDialogVisible: false,
  passwordDialogVisible: false,
  editingUser: false,
  userForm: {
    username: '',
    password: '',
    email: '',
    status: 1,
  },
  userRules: {
    username: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
    email: [
      { required: true, message: "请输入邮箱", trigger: "blur" },
      {
        type: 'email',
        message: '请输入正确的邮箱格式',
        trigger: ['blur', 'change']
      },
      {
        pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: '邮箱格式不正确',
        trigger: ['blur', 'change']
      }
    ],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  },
  passwordForm:{
    pwd: '',
    newPwd: '',
  },
  passwordRules:{
    pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
    newPwd: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  }
})

const getUserPage = () => {
  getUserList({
    username: state.searchForm.username,
    page: state.currentPage,
    size: state.pageSize,
  }).then(res => {
    if (res.code === 0) {
      state.userList = res.data.list;
      state.totalUser = res.data.total;
      console.log(res,state);
    }
  })
}

function handleSizeChange(val) {
  state.pageSize = val;
  state.currentPage = 1;
  getUserPage();
}
function handleCurrentChange(val) {
  state.currentPage = val;
  getUserPage();
}

function addUser() {
  state.userDialogVisible = true;
  state.editingUser = false;
  state.userForm = {
    username: '',
    password: '',
    email: '',
    status: 1,
  }
}

function saveUser(){
  userFormRef.value.validate((valid) => {
    if (valid) {
      if (state.editingUser) {
        // 编辑用户
        updateUser(state.userForm).then(res => {
          if (res.code === 0) {
            ElMessage.success("用户信息更新成功");
            state.userDialogVisible = false;
            getUserPage();
          }else{
            ElMessage.error(res.message || "用户信息更新失败");
          }
        });
      } else {
        // 新增用户
        createUser(state.userForm).then(res => {
          if (res.code === 0) {
            ElMessage.success("用户创建成功");
            state.userDialogVisible = false;
            getUserPage();
          }else{
            ElMessage.error(res.message || "用户创建失败");
          }
        });
      }
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
}

function editUser(row) {
  state.userDialogVisible = true;
  state.editingUser = true;
  state.userForm = { ...row };
}

function deleteUserClick(user) {
  deleteUser(user.id).then(res => {
    if (res.code === 0) {
      getUserPage();
    }
  })
}

function updatePasswordClick(){
  state.passwordDialogVisible = true;
  passwordFormRef.value.validate((valid) => {
    if (valid) {
      // Call API to update password
      updatePassword(state.passwordForm).then(res => {
        if (res.code === 0) {
          ElMessage.success("密码更新成功");
          closePasswordDialog();
        } else {
          ElMessage.error(res.message || "密码更新失败");
        }
      });
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
}

function showPasswordDialog(row){
  state.passwordDialogVisible = true;
  state.passwordForm = {
    id: row.id,
    pwd: '',
    newPwd: '',
  };
}

function closePasswordDialog(){
  state.passwordDialogVisible = false;
  state.passwordForm = {
    id: '',
    pwd: '',
    newPwd: '',
  };
}

onMounted(() => {
  getUserPage();
})
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
