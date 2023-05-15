<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="10" >
          <el-input 
          placeholder="请输入内容" 
          v-model="queryInfo.query"
          clearable
          @clear="getUserList">
            <el-button 
            slot="append" 
            icon="el-icon-search"
            @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button 
          type="primary" 
          @click="addUsersVisible = true">新增用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"  @change="useStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"> 
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button 
              type="primary" 
              icon="el-icon-edit" 
              circle size="mini"
              @click="showEditDialog(scope.row.id)">
              </el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button 
              type="danger" 
              icon="el-icon-delete" 
              circle size="mini"
              @click="removeUserById(scope.row.id)">
              </el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button 
              type="warning" 
              icon="el-icon-star-off" 
              circle size="mini">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 3, 5, 7]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>

      <!-- 新增用户弹窗 -->
      <el-dialog
        title="新增用户"
        :visible.sync="addUsersVisible"
        width="50%"
        @close="addDialogClose" >
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
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
        <span slot="footer">
          <el-button @click="addUsersVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUsers">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑窗口 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose">
        <!-- 内容主体区域 -->
        <el-form 
        :model="editForm" 
        :rules="editFormRules" 
        ref="editFormRef" 
        label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="editForm.email" prop="email"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="editForm.mobile" prop="mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 对话框底部区域 -->
        <span slot="footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  /*eslint-disable*/
  data(){
    // 自定义校验邮箱
    var checkEmail = (rule,vaule,callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(vaule)){
        return callback()
      }
      callback(new Error("请正确输入邮箱格式"))
    }
    // 自定义校验手机号
    var checkmobile = (rule,vaule,callback) => {
      const regmobile = /^1[3-9]\d{9}$/
      if(regmobile.test(vaule)){
        return callback()
      }
      callback(new Error("请正确输入手机号格式"))
    }

    return{ 
      queryInfo:{
        //搜索框关键字
        query:'',
        // 当前页数
        pagenum:1,
        // 当前每页显示多少条数据
        pagesize:5,
      },
      // 发起请求后获取的数据存放到 userslist
      userslist: [],
      // 总共有多少条数据
      total:0,
      //控制显示和隐藏
      addUsersVisible:false,
      //控制用户数据的显示和隐藏
      editDialogVisible:false,

      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      editForm:{
      },
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名在3-10个字符之间', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码格式需6-15位', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator: checkEmail , trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkmobile , trigger: 'blur' }
        ]
      },
      editFormRules:{
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator: checkEmail , trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkmobile , trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    this.getUserList();
  },
  methods:{
    async getUserList(){
      const {data:res} = await this.$http.get('users',{ params : this.queryInfo });
      console.log("res:", res);
      if(res.meta.status!==200) {return this.$message.error("获取数据失败");}
      this.userslist = res.data.users;
      this.total = res.data.total;
    },
    //拿到最新每页显示的页数 , 监听pagesize
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize;
      this.queryInfo.pagenum = 1;
      this.getUserList();
    },
    //页码值发生改变,监听currentsize
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听用户状态的修改
    async useStateChange(userinfo){
      const{data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
      console.log("111 res:", res);
      if(res.meta.status !== 200) { 
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("修改状态操作失败！");
      }
      return this.$message.success("修改状态成功！");
    },
    addDialogClose(){
      this.$refs.addFormRef.resetFields();
    },
    // 欲校验 通过则新增用户
    addUsers(){
      this.$refs.addFormRef.validate( async (valid) => {
        if(!valid) return;
        const{data:res} = await this.$http.post(`users`,this.addForm);
        if(res.meta.status !== 201){
          return this.$message.error("添加用户失败");
        }else{
          this.$message.success("添加用户成功");
        }
        // 不关失败或者成功 , 将窗口隐藏.
        this.addUsersVisible = false;
        this.getUserList();
      })
    },
    //编辑按钮功能
    async showEditDialog(id){
      const{data:res} = await this.$http.get(`users/${id}`);
      if(res.meta.status !== 200){
        return this.$message.error("通过id获取数据失败");
      }else{
        this.$message.success("通过id获取数据成功");
        this.editForm = res.data;
      }
      this.editDialogVisible = true;
    },
    //修改表单后的重置操作
    editDialogClose(){
      this.$refs.editFormRef.resetFields();
    },
    //更新用户信息
    editUserInfo(){
      this.$refs.editFormRef.validate( async (valid) => {
        if(!valid) return;
        const{data:res} = await this.$http.put(`users/${this.editForm.id}`,{
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        });
        if(res.meta.status !== 200){
          return this.$message.error("更新失败");
        }else{
          this.editDialogVisible = false;
          this.getUserList();
          this.$message.success("更新成功");
        }
      })
    },
    //列表数据删除功能
    async removeUserById(Id){
      /**
       * 点击确认 , confirmResult接收返回值则为字符串的 confirm
       * 点击取消则返回一个error,用catch捕获抛出 , confirmResult依旧接受的一个字符串 cancel
       */
      const confirmResult = await this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      })
      .catch(err => err)
      if(confirmResult !== 'confirm'){
        return this.$message.info("删除操作取消");
      }
      // 调用删除接口
      const {data:res} = await this.$http.delete(`users/${Id}`);
      if(res.meta.status !== 200) {return this.$message.error("删除失败")}
      this.$message.success("删除成功");
      this.getUserList(); 
    },
  }
}
</script>

<style lang="less" scoped>

</style>