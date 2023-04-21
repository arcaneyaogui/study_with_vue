<template>
  <el-button type="info" @click="logout">退出系统</el-button>
</template>

<script>
export default {
  methods:{
    logout (){
      // 清空token
      window.sessionStorage.clear();
      //跳转页面
      this.$router.push('/login');
    },
  },
}
</script>

<style lang="less" scoped>

</style>