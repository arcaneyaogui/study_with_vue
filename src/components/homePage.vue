<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png">
        <span>E-commerce system</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!-- 左侧菜单栏 -->
      <el-aside :width="isFold ? '64px' : '200px' " >
        <div class="foldMenu" @click="checkFold">|←||→|</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#62e2ff"
          :unique-opened="true"
          :collapse="isFold"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu 
          :index=" item.id+' ' "   
          v-for="item in menuList" 
          :key="item.id">
            <!-- 一级菜单栏模版 -->
            <template slot="title">
              <i :class="iconObject[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item 
            :index="'/'+itemTwo.path" 
            v-for="itemTwo in item.children" 
            :key="itemTwo.id"
            @click="sevaNavState('/'+itemTwo.path)">
              <i class="el-icon-menu"></i>
              <span>{{itemTwo.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return {
      // 左侧菜单栏数据
      menuList:[],
      iconObject:{
        '125':"el-icon-user",
        '103':"el-icon-key",
        '101':"el-icon-bank-card",
        '102':"el-icon-document",
        '145':"el-icon-folder-opened",
      },
      isFold:false,
      //链接di值--当前菜单名高亮
      activePath:''
    }
  },
  // 生命周期函数，一开始就要获取左侧菜单栏信息。
  created(){
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods:{
    logout (){
      // 清空token
      window.sessionStorage.clear();
      //跳转页面
      this.$router.push('/login');
    },
    // 获取左侧菜单栏的数据
    async getMenuList(){
      // 将整个对象中的data解构出来赋值给res
      const { data: res} = await this.$http.get('menus');
      if(res.meta.status !== 200) return this.$mess.error(res.meta.msg);
      this.menuList = res.data;
      console.log("左侧列表数据:", res);
    },
    //点击折叠左侧菜单栏
    checkFold(){
      // this.isFold = !this.isFold;
      this.isFold = this.isFold ? false : true;
    },
    //实现二级菜单点击高亮
    sevaNavState(activePath){
      // 将路径保存到session会话
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath;
    }
  },
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  // 左右贴边对其
  justify-content: space-between;
  align-items: center;
  color: #fff;
  >div{
    display: flex;
    align-items:center;
    font-size: 20px;
  }
  >div>img{
    height: 50px;
    margin-right: 20px;
  }
}
.el-aside{
  background-color:#333744;
  .el-menu{
    border-right:none;
  }
}
.el-main{
  background-color:#eaedf1;
}
// 折叠按钮
.foldMenu{
  color: #fff;
  font-size: 10px;
  text-align: center;
  line-height: 30px;
  letter-spacing: 0.3;
  background-color:#333744;
  //鼠标碰触 变小手
  cursor: pointer;
}
</style>