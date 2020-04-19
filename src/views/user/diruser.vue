<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="username" :placeholder="$t('user.username')" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('user.search') }}
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
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
        :total="total"
        :current-page="queryFilter.pageBean.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryFilter.pageBean.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>
<script>
import { fetchList } from '@/api/user'
import { isNull } from '@/utils/validate'
export default {
  name: 'DirUser',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      username: undefined,
      queryFilter: {
        pageBean: {
          page: 1,
          pageSize: 10,
          showTotal: true
        },
        querys: [],
        sorter: [
          {
            direction: 'DESC',
            property: 'createTime'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchList(this.queryFilter).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.queryFilter.pageBean.page = 1
      // clear params
      this.queryFilter.querys.length = 0
      if (!isNull(this.username)) {
        const userQuery = {
          'hasInitValue': true,
          'operation': 'LIKE',
          'property': 'username',
          'relation': 'AND',
          'value': '%' + this.username + '%'
        }
        this.queryFilter.querys.push(userQuery)
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.queryFilter.pageBean.pageSize = val
      this.queryFilter.pageBean.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryFilter.pageBean.page = val
      this.getList()
    }
  }
}
</script>
