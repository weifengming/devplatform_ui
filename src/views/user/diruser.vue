<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="username" :placeholder="$t('user.username')" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('button.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('button.add') }}
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
      <el-table-column prop="username" :label="$t('user.username')" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realname" :label="$t('user.realname')" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sex" :label="$t('user.sex')" width="70" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="telphone" :label="$t('user.telphone')" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.telphone }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" :label="$t('user.email')" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('user.status')" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('user.createtime')" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('button.operate')" align="center" width="230">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('button.edit') }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            {{ $t('button.delete') }}
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

    <el-dialog :title="$t('button.add')" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item :label="$t('user.username')" prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item :label="$t('user.realname')" prop="realname">
          <el-input v-model="ruleForm.realname" placeholder="请输入真实" />
        </el-form-item>
        <el-form-item :label="$t('user.sex')" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="1">{{ $t('dict.male') }}</el-radio>
            <el-radio label="2">{{ $t('dict.female') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('user.telphone')" prop="telphone">
          <el-input v-model="ruleForm.telphone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item :label="$t('user.email')" prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item :label="$t('user.org')" prop="orgId">
          <select-tree v-model="orgId" :options="options" :props="defaultProps" />
        </el-form-item>
        <el-form-item :label="$t('user.status')" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="1">{{ $t('dict.open') }}</el-radio>
            <el-radio label="2">{{ $t('dict.close') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('user.comment')" prop="comment">
          <el-input v-model="ruleForm.comment" type="textarea" />
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('button.save') }}</el-button>
          <el-button @click="dialogFormVisible = false">{{ $t('button.cancel') }}</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        v-show="treeVisible"
        :props="props"
        :load="loadNode"
        lazy
        show-checkbox
      />
    </el-dialog>

  </div>
</template>
<script>
import { fetchList, addUser, updateById, deleteById } from '@/api/user'
import { jsonParentsOrgTree, jsonOrgTreeByParentId } from '@/api/org'
import { isNull } from '@/utils/validate'
import SelectTree from '@/components/SelectTree/index'
export default {
  name: 'DirUser',
  components: {
    SelectTree
  },
  data() {
    // email rule
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // phone rule
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('手机号码格式不正确'))
    }

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
      treeVisible: false,
      props: {
        id: 'id',
        children: [],
        label: 'name',
        isLeaf: 'leaf'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      ruleForm: {
        id: '',
        username: '',
        realname: '',
        sex: '1',
        telphone: '',
        email: '',
        orgId: '',
        status: '1',
        comment: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        telphone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择开启状态', trigger: 'change' }
        ]
      },
      // 默认选中值
      orgId: 'A',
      // 数据默认字段
      defaultProps: {
        parent: 'parentId', // 父级唯一标识
        value: 'id', // 唯一标识
        label: 'label', // 标签显示
        children: 'children' // 子级
      },
      // 数据列表
      options: [{}]
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
    handleUpdate(row) {
      this.ruleForm = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$alertMsgBox('确认要删除该数据？', '提示', { type: 'warning' })
        .then(() => {
          deleteById(row.id).then(response => {
            const state = response.state
            if (state === true) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 2000
              })
            }
          })
        })
        .catch(() => {})
    },
    resetRuleForm() {
      this.ruleForm = {
        id: '',
        username: '',
        realname: '',
        sex: '1',
        telphone: '',
        email: '',
        orgId: '',
        status: '1',
        comment: ''
      }
    },
    handleCreate() {
      this.resetRuleForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          addUser(this.ruleForm).then(response => {
            const state = response.state
            if (state === true) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    updateData() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          updateById(this.ruleForm).then(response => {
            const state = response.state
            if (state === true) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.message,
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: response.message,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleSizeChange(val) {
      this.queryFilter.pageBean.pageSize = val
      this.queryFilter.pageBean.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryFilter.pageBean.page = val
      this.getList()
    },
    selectOrgTree() {
      this.treeVisible = true
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        jsonParentsOrgTree().then(response => {
          const state = response.state
          if (state === true) {
            const data = response.data
            return resolve(data)
          }
        })
      }
      if (node.level >= 1) {
        this.loadNodeNext(node, resolve)
      }
    },
    loadNodeNext(node, resolve) {
      const id = node.data.id
      jsonOrgTreeByParentId(id).then(response => {
        const data = response.data
        resolve(data)
      })
    }
  }
}
</script>
