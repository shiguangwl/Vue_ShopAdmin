<template>
  <div>
    <h3>用户列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表(表格)区域 -->
      <el-row style="margin-top: 10px">
        <el-table :data="userList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)"></el-button>
              <!-- 删除 -->
              <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.id)"></el-button>
              <!-- 分配角色 -->
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页导航区域
      @size-change(pagesize改变时触发)
      @current-change(页码发生改变时触发)
      :current-page(设置当前页码)
      :page-size(设置每页的数据条数)
      :total(设置总页数) -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 对话框组件  :visible.sync(设置是否显示对话框) width(设置对话框的宽度)
:before-close(在对话框关闭前触发的事件) -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 对话框主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 对话框主体区域 -->
    <el-dialog title="添加用户" :visible.sync="editDialogVisible" @close="editDialogClosed" width="50%">
      <!-- 对话框主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      // 控制修改用户对话框的显示与否
      editDialogVisible: false,
      // 修改用户的表单数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '邮箱格式不正确，请重新输入',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码不正确，请重新输入',
            trigger: 'blur'
          }
        ]
      },
      // 获取查询用户信息的参数
      queryInfo: {
        // 查询的条件
        query: '',
        // 当前的页数，即页码
        pagenum: 1,
        // 每页显示的数据条数
        pagesize: 5
      },
      // 保存请求回来的用户列表数据
      userList: [],
      total: 0,
      // 是否显示添加用户弹出窗
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      // 发送请求获取用户列表数据
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      // 如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) { return this.$message.error('获取用户列表失败') }
      // 如果返回状态正常，将请求的数据保存在data中
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      // pagesize改变时触发，当pagesize发生改变的时候，我们应该
      // 以最新的pagesize来请求数据并展示数据
      //   console.log(newSize)
      this.queryInfo.pagesize = newSize
      // 重新按照pagesize发送请求，请求最新的数据
      this.getUserList()
    },
    handleCurrentChange (current) {
      // 页码发生改变时触发当current发生改变的时候，我们应该
      // 以最新的current页码来请求数据并展示数据
      console.log(current)
      this.queryInfo.pagenum = current
      // 重新按照pagenum发送请求，请求最新的数据
      this.getUserList()
    },
    async userStateChanged (row) {
      // 发送请求进行状态修改
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      // 如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error('修改状态失败')
      }
      this.$message.success('更新状态成功')
    },
    addDialogClosed () {
      // 对话框关闭之后，重置表达
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      // 点击确定按钮，添加新用户
      // 调用validate进行表单验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写完整用户信息')
        // 发送请求完成添加用户的操作
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        // 判断如果添加失败，就做提示
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        // 添加成功的提示
        this.$message.success('添加用户成功')
        // 关闭对话框
        this.addDialogVisible = false
        // 重新请求最新的数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      // 发送请求根据id获取用户信息
      const { data: res } = await this.$http.get('users/' + id)
      // 判断如果添加失败，就做提示
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      // 将获取到的数据保存到数据editForm中
      this.editForm = res.data
      // 显示弹出窗
      this.editDialogVisible = true
    },
    editDialogClosed () {
      // 对话框关闭之后，重置表达
      this.$refs.editFormRef.resetFields()
    },
    editUser () {
      // 用户点击修改表单中的确定按钮之后，验证表单数据
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写完整用户信息')
        // 发送请求完成修改用户的操作
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          this.editForm
        )
        // 判断如果修改失败，就做提示
        if (res.meta.status !== 200) return this.$message.error('修改用户失败')
        // 修改成功的提示
        this.$message.success('修改用户成功')
        // 关闭对话框
        this.editDialogVisible = false
        // 重新请求最新的数据
        this.getUserList()
      })
    },
    async removeUserById (id) {
      // 弹出确定取消框，是否删除用户
      const confirmResult = await this.$confirm('请问是否要永久删除该用户', '删除提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //  如果用户点击确认，则confirmResult 为'confirm'
      // 如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      // eslint-disable-next-line eqeqeq
      if (confirmResult != 'confirm') { return this.$message.info('已经取消删除') }
      //  发送请求根据id完成删除操作
      const { data: res } = await this.$http.delete('users/' + id)
      // 判断如果删除失败，就做提示
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      // 修改成功的提示
      this.$message.success('删除用户成功')
      // 重新请求最新的数据
      this.getUserList()
    }
  }
}
</script>

<style scoped>

</style>
