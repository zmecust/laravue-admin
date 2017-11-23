<template>
  <div class="content">
    <div class="search">
      <el-form label-width="80px" ref="searchform" :model="searchform">
        <el-input placeholder="请输入角色名" icon="search" v-model="searchform.name" style="width: 30%; float: left; margin-right: 20px"></el-input>
        <el-form-item>
          <el-button type="primary" @click="submit()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-button @click="add()" icon="plus" type="primary" class="add"  v-has="has(create_role)">创建角色</el-button>
      <el-table v-bind:data="tableData" border style="width: 100%" highlight-current-row :fit="listWidth">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column prop="id" label="id" :align="align" v-if="false">
        </el-table-column>
        <el-table-column prop="name" label="角色名：" :align="align">
        </el-table-column>
        <el-table-column prop="description" label="角色描述：" :align="align">
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间：" :align="align">
        </el-table-column>
        <el-table-column label="操作" width="220" :align="align">
          <template scope="scope">
            <el-button size="small" @click="edit(scope.$index, scope.row.id)" icon="edit" v-has="has(edit_role)">编辑</el-button>
            <el-button size="small" type="danger" @click="del(scope.$index, scope.row.id)" icon="delete" v-has="has(delete_role)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="dialogTitle" v-bind:close-on-click-modal="false" v-model="showEdit" v-bind:close-on-press-escape="true">
        <el-form v-bind:model="editTable" ref="editForm" label-position="left" label-width="100px">
          <el-form-item label="角色名：">
            <el-input v-model="editTable.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：">
            <el-input v-model="editTable.description"></el-input>
          </el-form-item>

          <el-form-item label="赋予权限：">
            <el-checkbox :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="permissions">
              <div v-for="(group, index) in groupPermissions" :key="index">
                <div class="permission">
                  <p>{{index}} 模块:</p>
                  <el-checkbox style="float: left" v-for="permission in group" :label="permission.display_name" :key="permission.id"></el-checkbox>
                </div>
              </div>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" v-on:click="save" :loading="load">确 定</el-button>
            <el-button type="primary" v-on:click="cancel">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <div class="pagination">
        <el-pagination layout="sizes,prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="total" :page-size="pageSize" :page-sizes="pageSizes">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetter } from 'vuex';
import api from '../../api';
import data from '../../mixins/data';

export default {
  name: 'show',
  mixins: [data],
  data() {
    return {
      editTable: {
        description: '',
        name: ''
      },
      groupPermissions: null,
      permissions: [],
      groupKey: {},
      isIndeterminate: true,
      create_role: api.manage.create_role,
      edit_role: api.manage.edit_role,
      delete_role: api.manage.delete_role
    }
  },
  mounted() {
    this.datas();
  },
  methods: {
    async datas(filter, val) {
      api.manage.get_roles.request({ params: { filter: filter, paginate: this.pageSize, page: val } }).then((res) => {
        var res = res.data.data;
        this.tableData = [...res.data];
        this.total = Number(res.total);
      })
    },
    handleCurrentChange(val) {
      if (this.searchform.name) {
        this.datas(this.searchform.name, val);
      }
      this.datas(undefined, val);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.searchform.name) {
        this.datas(this.searchform.name);
      } else {
        this.datas();
      }
    },
    handleCheckAllChange(event) {
      let select_permissions = [];
      for (let index1 in this.groupPermissions) {
        for (let index2 in this.groupPermissions[index1]) {
          select_permissions.push(this.groupPermissions[index1][index2].display_name);
        }
      }
      this.permissions = event.target.checked ? select_permissions : [];
      this.isIndeterminate = false;
    },
    add() {
      this.editTable = {};
      this.isAdd = true;
      this.showEdit = true;
      this.dialogTitle = "新增角色";
      this.permissions = [];
      this.isIndeterminate = true;
      api.manage.group_permissions.request().then((res) => {
        this.groupPermissions = res.data.data;
      })
    },
    edit(index, id) {
      this.editTable = {};
      this.id = id;
      this.index = index;
      this.dialogTitle = "编辑角色";
      this.isAdd = false;
      this.isIndeterminate = true;
      api.manage.group_permissions.request().then((res) => {
        this.groupPermissions = res.data.data;
        console.log(this.groupPermissions);
      })
      api.manage.get_role.request(this.id).then((res) => {
        this.showEdit = true;
        this.editTable = res.data.data;
        this.permissions = res.data.data.permissions;
      })
    },
    del(index, id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.manage.delete_role.request(id).then((res) => {
          if (1 == res.data.status) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'success'
            });
            this.tableData.splice(index, 1);
          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'error'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    save() {
      this.load = true;
      if (this.isAdd) {
        api.manage.create_role.request({
          permission: this.permissions,
          name: this.editTable.name,
          description: this.editTable.description,
        }).then((res) => {
          if (res.data.status == 0) {
            this.messageType = "error"
          } else {
            this.messageType = "success"
            this.tableData.push(res.data.data);
          }
          this.$message({
            message: res.data.message,
            type: this.messageType
          });
          this.load = false, this.showEdit = false
        })

      } else {
        api.manage.edit_role.request(this.id, {
          permission: this.permissions,
          name: this.editTable.name,
          description: this.editTable.description,
        }).then((res) => {
          if (res.data.status == 0) {
            this.messageType = "error"
          } else {
            this.messageType = "success"
            this.tableData.splice(this.index, 1, res.data.data);
          }
          this.$message({
            message: res.data.message,
            type: this.messageType
          });
          this.load = false, this.showEdit = false
        })
      }
    },
    cancel() {
      this.editTable = {};
      this.showEdit = false;
      this.load = false
    },
    submit() {
      this.datas(this.searchform.name)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  padding: 20px;
  .add {
    margin: 0 0 10px;
  }
  .permission {
    clear: both;
    p {
      font-size: 16px;
      font-weight: bold;
      color: #20A0FF;
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
  .searchInput {
    float: left;
    width: 40%;
    padding-right: 20px;
  }
  .pagination {
    padding-top: 15px;
    text-align: right;
  }
}
</style>