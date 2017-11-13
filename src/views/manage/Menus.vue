<template>
  <div class="content">
    <div class="table">
      <el-button @click="add()" icon="plus" type="primary" class="add" v-has="has(get_all_menus)">添加一级菜单</el-button>
      <el-tree :data="data2" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent">
      </el-tree>
    </div>
    <el-dialog :title="dialogTitle" v-bind:close-on-click-modal="false" v-model="showEdit" v-bind:close-on-press-escape="true">
      <el-form v-bind:model="editTable" ref="editForm" label-position="left" label-width="100px">
        <el-form-item label="菜单名称：">
          <el-input v-model="editTable.display_name"></el-input>
        </el-form-item>
        <el-form-item label="导航地址：">
          <el-input v-model="editTable.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="save" :loading="load">确 定</el-button>
          <el-button type="primary" v-on:click="cancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script >
import api from '../../api';
import data from '../../mixins/data';

export default {
  name: 'show',
  mixins: [data],
  data() {
    return {
      editTable: {
        display_name: '',
        name: '',
      },
      parent_id: '',
      data2: null,
      defaultProps: {
        children: 'children',
        label: 'display_name'
      },
      get_all_menus: api.manage.get_all_menus,
      create_menu: api.manage.create_menu,
      edit_menu: api.manage.edit_menu,
      delete_menu: api.manage.delete_menu
    }
  },
  mounted() {
    this.datas();
  },
  methods: {
    async datas() {
      api.manage.get_all_menus.request().then((res) => {
        var res = res.data;
        this.data2 = [...res.data];
      })
    },
    save() {
      this.load = true;
      if (this.isAdd) {
        api.manage.create_menu.request({
          parent_id: this.parent_id,
          name: this.editTable.name,
          display_name: this.editTable.display_name,
        }).then((res) => {
          if (res.data.status == 0) {
            this.messageType = "error"
          } else {
            this.messageType = "success"
            this.datas();
          }
          this.$message({
            message: res.data.message,
            type: this.messageType
          });
          this.load = false, this.showEdit = false
        })
      } else {
        api.manage.edit_menu.request(this.id, {
          name: this.editTable.name,
          display_name: this.editTable.display_name,
        }).then((res) => {
          console.log(res.data);
          if (res.data.status == 0) {
            this.messageType = "error"
          } else {
            this.messageType = "success"
            this.datas();
          }
          this.$message({
            message: res.data.message,
            type: this.messageType
          });
          this.load = false, this.showEdit = false
        })
      }
    },
    renderContent: function(createElement, { node, data, store }) {
      var self = this;
      return createElement('span', [
        createElement('span', node.label),
        createElement('span', {
          attrs: {
            style: "float: right; margin-right: 20px"
          }
        }, [
            createElement('el-button', {
              attrs: {
                size: "mini",
                type: "info"
              }, on: {
                click: function() {
                  self.add(data.id);
                  //store.append({ id: self.baseId++, label: 'testtest', children: [] }, data);
                }
              }
            }, "增加"),
            createElement('el-button', {
              attrs: {
                size: "mini",
                type: "success"
              }, on: {
                click: function() {
                  self.edit(data.id);
                  //store.append({ id: self.baseId++, label: 'testtest', children: [] }, data);
                }
              }
            }, "编辑"),
            createElement('el-button', {
              attrs: {
                size: "mini",
                type: "danger"
              }, on: {
                click: function() {
                  self.del(data.id);
                }
              }
            }, "删除"),
          ]),
      ]);
    },
    cancel() {
      this.editTable = {};
      this.showEdit = false;
      this.load = false
    },
    add(id) {
      this.editTable = {};
      this.parent_id = id;
      this.isAdd = true;
      this.showEdit = true;
      this.dialogTitle = "新增菜单";
    },
    edit(id) {
      this.editTable = {};
      this.id = id;
      this.dialogTitle = "编辑菜单";
      this.isAdd = false;
      api.manage.get_menu.request(this.id).then((res) => {
        this.showEdit = true;
        this.editTable = res.data.data;
      })
    },
    del(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.manage.delete_menu.request(id).then((res) => {

          if (1 == res.data.status) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'success'
            });

            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'error'
            });
          }

        }, function(res) {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  padding: 20px;
  .add {
    margin-bottom: 10px;
  }
}
</style>