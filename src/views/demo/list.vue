<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="标题" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search">
        搜索
      </el-button>
    </div>
    <el-table
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="username" label="登录名" align="center" />
      <el-table-column prop="realname" label="姓名" width="200" align="center" />
      <el-table-column prop="sex" label="性别" width="70" align="center" />
      <el-table-column prop="phone" label="手机号" width="150" align="center" />
      <el-table-column prop="email" label="邮箱" align="center" />
      <el-table-column prop="active" label="激活状态" width="100" align="center" />
      <el-table-column label="操作" align="center" width="230">
        <template>
          <el-button type="primary" size="mini">
            编辑
          </el-button>
          <el-button type="danger" size="mini">
            删除
          </el-button>
        </template>
      </el-table-column>
      </el-table>
  </div>
</template>
<script>
export default {
  name: 'DirUser',
  data() {
    return {
      tableData: [{
        id: 1,
        username: 'wangxh',
        realname: '王小虎',
        sex: '男',
        phone: '18888888888',
        email: 'abc@163.com',
        active: '已激活'
      }, {
        id: 2,
        username: 'wangxh',
        realname: '王小虎',
        sex: '男',
        phone: '18888888888',
        email: 'abc@163.com',
        active: '已激活'
      }, {
        id: 3,
        username: 'wangxh',
        realname: '王小虎',
        sex: '男',
        phone: '18888888888',
        email: 'abc@163.com',
        active: '已激活'
      }, {
        id: 4,
        username: 'wangxh',
        realname: '王小虎',
        sex: '男',
        phone: '18888888888',
        email: 'abc@163.com',
        active: '已激活'
      }]
    }
  }
}
</script>
