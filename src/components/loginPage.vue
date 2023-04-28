<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="photo_is_bad">
      </div>

      <el-form 
      :model="loginForm"             
      :rules="loginFormRules"
      ref="loginFormRef"  
      class="login_form">

          <!-- 登录框 -->
          <el-form-item prop="username">
            <el-input 
            v-model="loginForm.username" 
            prefix-icon="el-icon-user-solid"
            ></el-input>
          </el-form-item>

          <!-- 密码框 -->
          <el-form-item prop="password">
            <el-input 
            v-model="loginForm.password" 
            prefix-icon="el-icon-lock" 
            type="password"
            ></el-input>
          </el-form-item>

          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="check_loginForm">确定</el-button>
            <el-button type="info" @click="reset_loginForm">取消</el-button>
          </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
export default {

  data(){
    return{
      // 表单数据绑定
      loginForm:{
        username:'admin',
        password:'123456',
      },
      // 校验规则 
      loginFormRules:{
        username:[
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 5, message: '用户名长度在3-5个字符之间', trigger: 'blur' }
        ],
        password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '密码长度应在6-12字符之间', trigger: 'blur' }
        ],
      },
    }
  },

  methods:{
    // 点击取消 重置表单
    reset_loginForm(){
      console.log("🚀reset_loginForm ~ this:", this);
      // 还原data里的表单数据
      Object.assign(this.$data.loginForm, this.$options.data().loginForm);
      // 重置实例对象.
      this.$refs.loginFormRef.resetFields();
    },

    // 直接使用validate检查 符合rules则表示成功，不符合则报错
    check_loginForm(){      
      this.$refs.loginFormRef.validate( async (valid) => {
        if(!valid) return;

        const result = await this.$http.post('login',this.loginForm);
        const res = result.data;
        console.log("🚀res:", res);
        
        if(res.meta.status !==200){
          return this.$message.error('登录失败');
        }
        
        this.$message({
          message: '登录成功',
          type: 'success'
        });

        /**
         * localStorage用于持久化储存，sessionStorage用户会话期间存储
         * 保存token到sessionStorage中 ， 因为项目中除了登录的api接口，
         * 其他的接口都需要在登录后，本地有服务器的token才能让其访问。
         * 
         * 登录成功需要做两件事:
         * 1. 保存token到sessionStorage中
         * 2. 页面跳转到主页,并且点击返回不能返回到登录页.
         */
        window.sessionStorage.setItem("token",res.data.token);
        //使用push方法,直接跳转路由
        this.$router.push('/home');

      })
    },


  }
}
</script>

<style lang="less" scoped>
.login_container{
  height: 100%;
  width: 100%;
  background-color: #264a6b;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  // 让盒子居中
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius:50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position:absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius:50%;
    background-color: #eee;
  }
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // 包含border 和 padding
  box-sizing: border-box;
}

.btns{
  display: flex;
  // 横轴上--末尾
  justify-content: flex-end;
}
</style>