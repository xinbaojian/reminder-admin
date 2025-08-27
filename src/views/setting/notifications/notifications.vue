<template>
  <div class="notifications-container">
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in state.dataList"
        :key="index"
        :lg="6"
        :md="6"
        :sm="6"
        :xl="3"
        :xs="12"
      >
        <el-card style="max-width: 580px">
          <template #header>
            <div class="card-header">
              <span v-if="item.channel === 1">Bark消息设置</span>
              <span v-if="item.channel === 2">企业微信消息设置</span>
              <span v-if="item.channel === 3">钉钉消息设置</span>
            </div>
          </template>
          <el-form>
            <el-form-item label="推送地址" prop="url">
              <el-input
                v-model="state.dataList[index].channel"
                style="display: none"
              />
              <el-input
                v-model="state.dataList[index].url"
                placeholder="请输入Bark服务器地址"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="state.dataList[index].status"
                :active-value="1"
                :inactive-value="2"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <div style="text-align: center">
              <el-button type="primary" @click="saveOrUpdateSettings(index)"
                >保存</el-button
              >
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="ts" setup>
import { onMounted, reactive } from 'vue';
import { getNotificationSettings,updateNotificationSettings } from "@/api/notifications";
import { ElMessage } from 'element-plus';

const state = reactive({
  dataList:[],
});

function getData(){
  getNotificationSettings().then((res) => {
    if (res.code === 0) {
      state.dataList = res.data.list;
    }
  });
}

function saveOrUpdateSettings(index) {
  const item = state.dataList[index];
  updateNotificationSettings(item).then((res) => {
    if (res.code === 0) {
      ElMessage.success('设置成功');
    }else{
      ElMessage.error('设置失败');
    }
  });
}

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.notifications-container {
  padding: 20px;
}
</style>
