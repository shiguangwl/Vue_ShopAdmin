<template>
  <div class="login_containner">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <!--     element Ui-->
      <el-form ref="loginform" :model="form" :rules="rules" label-width="0px" class="login_form">
        <el-form-item prop="checkname">
          <el-input v-model="form.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input v-model="form.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="qingqiulogin">确认</el-button>
          <el-button type="primary" @click="resetloginform()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        checkname: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetloginform () {
      this.$refs.loginform.resetFields()
    },
    async qingqiulogin () {
      const { data: res } = await this.$http.post('login', this.form)
      if (res.meta.status !== 200) {
        return this.$message.error('登录错误')
      }
      this.$message.success('登录成功')
      window.sessionStorage.setItem('token', res.data.token)
      // 导航至/home
      this.$router.push('/home')
    }
  }
}

</script>
<style lang="less" scoped>
  .login_containner{
    padding-top: 1px;
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: white;
    margin: 100px auto;
    border-radius: 5px;
  }
  .avatar_box{
    position: absolute;
    top: 60px;
    left:46%;
    width: 100px;
    height: 100px;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #ddd;
      border: white 5px solid;
    }
  }

  .login_form{
    transform: translateY(100px);
    box-sizing: border-box;
    padding: 0 10px;
  }
</style>
