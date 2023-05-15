<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="10" >
          <el-input 
          placeholder="请输入内容" 
          v-model="query"
          clearable
          @clear="getRolesList">
          <el-button 
            slot="append" 
            icon="el-icon-search"
            @click="getRolesList"></el-button>
          </el-input>
        </el-col>

        <!-- 添加角色按钮 -->
        <el-col :span="6">
          <el-button 
          type="primary"
          @click="addRoleVisible = true">
              添加角色
          </el-button>
        </el-col>
      </el-row>

      <!-- border 表格添加边框 ，stripe 隔行变色  -->
        <el-table :data="rolesList" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 渲染列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName" ></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc" ></el-table-column>
            <el-table-column label="操作" width="130px">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="编辑" placement="top">
                    <el-button 
                    type="primary" 
                    icon="el-icon-edit" 
                    circle size="mini"
                    effect="dark" 
                    content="Top Center 提示文字" 
                    placement="top"
                    @click="showEditForm(scope.row.id)">
                    </el-button>                
                </el-tooltip>

                <el-tooltip effect="dark" content="删除" placement="top">
                    <el-button 
                    type="danger" 
                    icon="el-icon-delete" 
                    circle size="mini"
                    effect="dark" 
                    content="Top Center 提示文字" 
                    placement="top"
                    @click="removeRole(scope.row.id)">
                    </el-button>             
                </el-tooltip>

                <el-tooltip effect="dark" content="角色权限" placement="top">
                    <el-button 
                    type="warning" 
                    icon="el-icon-star-off" 
                    circle size="mini">
                    </el-button>           
                </el-tooltip>
              </template>
            </el-table-column>
        </el-table>
        
        <!-- 新增角色弹出窗口 -->
        <el-dialog
          title="新增 =_=||"
          :visible.sync="addRoleVisible"
          width="50%"
          @close="addRolesFormClose">
            <el-form 
              label-width="100px"
              :model="rolesForm" 
              :rules="roleFormRules"
              ref="rolesFormRef">
                  <el-form-item  label="角色名称" prop="roleName">
                    <el-input v-model="rolesForm.roleName" ></el-input>
                  </el-form-item>
                  <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="rolesForm.roleDesc" ></el-input>
                  </el-form-item>
            </el-form>
            <span slot="footer">
              <el-button @click="addRoleVisible = false">取 消</el-button>
              <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色弹出窗口 -->
        <el-dialog
          title="编辑弹窗"
          :visible.sync="editRoleVisible"
          width="50%">
            <el-form
            :model="editForm"
            label-width="100px"
            :rules="editRoleRules"
            ref="editRoleFormRef">
                  <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                  </el-form-item>
                  <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                  </el-form-item>
            </el-form>
            <span slot="footer">
              <el-button @click="editRoleVisible = false">取 消</el-button>
              <el-button type="primary" @click="editRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  /*eslint-disable*/
    data(){
        return{
          // 搜索框文本
          query:'',

          // 控制新增窗口的显示和隐藏
          addRoleVisible: false,
          editRoleVisible: false,

          // 存储获取到的数据,使用的数组
          rolesList:[],

          //新增用户,需要自定义成员
          rolesForm:{
            roleName:'',
            roleDesc:''
          },
          //编辑用户时存储信息用
          editForm:{

          },
          // 规则是对象,每一个元素是个数组
          roleFormRules:{
            roleName:[
              { required: true, message: '请输入角色名称', trigger: 'blur' },
              { min: 2, max: 10, message: '角色名称应该在2-10个字符之间', trigger: 'blur' }
            ],
            roleDesc:[
              { required: true, message: '请输入角色描述', trigger: 'blur' },
              { min: 5, max: 20, message: '描述字符应该在5-20之之间', trigger: 'blur' }
            ],
          },
          editRoleRules:{
            roleName:[
              { required: true, message: '请输入角色名称', trigger: 'blur' },
              { min: 2, max: 10, message: '角色名称应该在2-10个字符之间', trigger: 'blur' }
            ],
            roleDesc:[
              { required: true, message: '请输入角色描述', trigger: 'blur' },
              { min: 5, max: 20, message: '描述字符应该在5-20之之间', trigger: 'blur' }
            ],
          }
        }
    },
    created(){
        this.getRolesList();
    },
    methods:{
      /**----- 查询 ------ */
        async getRolesList(){
            const {data:res} = await this.$http.get('roles');
            if(res.meta.status !== 200){return this.$message.error("数据获取失败")}
            this.rolesList = res.data;
        },
        //输入值之后重置表单
        addRolesFormClose(){
          // Object.assign(this.$data.rolesForm, this.$options.data().rolesForm);
          this.$refs.rolesFormRef.resetFields();
        },
      /**----- 按钮点击新增 ------ */
        async addRole(){
          // 调用接口 , 创建新用户
          const{data:res} = await this.$http.post('roles',{ 
            roleName : this.rolesForm.roleName,
            roleDesc : this.rolesForm.roleDesc
          });
          if(res.meta.status !== 201){return this.$message.error("添加角色失败")}
          //成功 则关闭窗口 , 再次查询.
          this.addRoleVisible = false;
          this.getRolesList();
          this.$message.success("添加角色成功");
        },
      /**----- 编辑 ------ */
        async showEditForm(id){
          const{data:res}  = await this.$http.get(`roles/${id}`);
          if(res.meta.status != 200){
            return this.$message.error("编辑失败不可编辑");
          }else{
            this.editForm = res.data;
          }
          this.editRoleVisible = true;
        },
        // 点击确定,发送请求
        editRoleInfo(){
          this.$refs.editRoleFormRef.validate( async (valid) => {
            if(!valid) return;
            const {data : res} = await this.$http.put(`roles/${this.editForm.roleId}`,{
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc,
            });
            if(res.meta.status != 200) {
              return this.$message.error("修改失败");
            }else{
              this.editRoleVisible = false;
              this.getRolesList();
              this.$message.success("修改成功");
            }
          })
        },
        /**
        * 点击确认 , confirmResult接收返回值则为字符串的 confirm
        * 点击取消则返回一个error,用catch捕获抛出 , 
        * confirmResult依旧接受的一个字符串 cancel
        */
        async removeRole(id){
          const confirmResult = await this.$confirm('确认删除吗?','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .catch(err => err)
          if(confirmResult !== 'confirm'){
            return this.$message.info("删除操作取消");
          }else{
            const {data:res} = await this.$http.delete(`roles/${id}`);
            if(res.meta.status !== 200) {
              return this.$message.error("删除失败");
            }else{
              this.$message.success("删除成功");
              this.getRolesList(); 
            }
          }
        },

    }
}
</script>
