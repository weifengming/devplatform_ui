<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="username" :placeholder="$t('user.username')" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('user.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
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

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker v-model="ruleForm.date2" placeholder="选择时间" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery" />
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type" />
            <el-checkbox label="地推活动" name="type" />
            <el-checkbox label="线下主题活动" name="type" />
            <el-checkbox label="单纯品牌曝光" name="type" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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
      },
      dialogFormVisible: false,
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
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
    handleCreate() {
      this.dialogFormVisible = true
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
