<template>
  <div class="login_containner">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
<!--      &lt;!&ndash;     element Ui&ndash;&gt;-->
<!--      <el-form ref="form" :model="form" label-width="80px">-->
<!--        <el-form-item label="活动名称">-->
<!--          <el-input v-model="form.name"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'login'
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
</style>
