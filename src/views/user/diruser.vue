<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('user.username')" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search">
        {{ $t('user.search') }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="username" :label="$t('user.username')" align="center" />
      <el-table-column prop="realname" :label="$t('user.realname')" width="200" align="center" />
      <el-table-column prop="sex" :label="$t('user.sex')" width="70" align="center" />
      <el-table-column prop="telphone" :label="$t('user.telphone')" width="150" align="center" />
      <el-table-column prop="email" :label="$t('user.email')" align="center" />
      <el-table-column prop="status" :label="$t('user.status')" width="100" align="center" />
      <el-table-column :label="$t('user.operate')" align="center" width="230">
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

    <div class="pagination-container">
      <el-pagination
        background
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      />
    </div>

  </div>
</template>
<script>
import { fetchList } from '@/api/user'
export default {
  name: 'DirUser',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {

      },
      tableData: [{
        id: 1,
        username: 'wangxh',
        realname: '王小虎',
        sex: '男',
        telphone: '18888888888',
        email: 'abc@163.com',
        status: '已激活'
      }, {
        id: 2,
        username: 'wangxh',
        realname: '王小虎',
        sex: '男',
        telphone: '18888888888',
        email: 'abc@163.com',
        status: '已激活'
      }, {
        id: 3,
        username: 'wangxh',
        realname: '王小虎',
        sex: '男',
        telphone: '18888888888',
        email: 'abc@163.com',
        status: '已激活'
      }, {
        id: 4,
        username: 'wangxh',
        realname: '王小虎',
        sex: '男',
        telphone: '18888888888',
        email: 'abc@163.com',
        status: '已激活'
      }],
      currentPage4: 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchList(this.listQuery).then(response => {

      })
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    }
  }
}
</script>
