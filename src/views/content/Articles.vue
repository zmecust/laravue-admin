<template>
  <div class="content">
    <div class="search">
      <el-form label-width="80px" ref="searchform" :model="searchform">
        <el-input placeholder="请输入文章title" icon="search" v-model="searchform.name" style="width: 30%; float: left; margin-right: 20px"></el-input>
        <el-form-item>
          <el-button type="primary" @click="submit()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table v-bind:data="tableData" border style="width: 100%" highlight-current-row :fit="listWidth">
        <el-table-column align="center" label="序号" width="80">
          <template scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user.name" label="作者：" :align="align">
        </el-table-column>
        <el-table-column prop="title" width="400" label="标题：" :align="align">
          <template scope="scope">
            <span class="link-type" @click="edit(scope.$index, scope.row.id)">{{scope.row.title}}</span>
            <el-tag>{{scope.row.category.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="modify_roles" width="250" label="标签：" :align="align">
          <template scope="scope">
            <el-tag close-transition v-for="index in scope.row.tags" :key="index.id">{{index.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="view_count" sortable label="查看数：" :align="align">
        </el-table-column>
        <el-table-column prop="likes_count" sortable label="点赞数：" :align="align">
        </el-table-column>
        <el-table-column prop="is_hidden" label="是否隐藏：" :align="align">
        </el-table-column>
        <el-table-column prop="created_at" sortable label="创建时间：" :align="align">
          <template scope="scope">
            <span>{{scope.row.created_at.slice(0, 16)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" :align="align">
          <template scope="scope">
            <el-button :type="scope.row.edit?'success':'primary'" @click='handerUpdate(scope.$index, scope.row.id, scope.row.edit=!scope.row.edit)' size="small" icon="edit">{{scope.row.edit?'完成':'编辑'}}</el-button>
            <el-button size="small" type="danger" @click="del(scope.$index, scope.row.id)" icon="delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="dialogTitle" v-bind:close-on-click-modal="false" v-model="showEdit" v-bind:close-on-press-escape="true">
        <el-form v-bind:model="editTable" ref="editForm" label-position="left" label-width="100px">
          <el-form-item label="角色名：">
            <el-select size="" class="select" multiple v-model="editRoles">
              <el-option v-for="item in roles" :label="item.description" :value="item.description" key="1">
              </el-option>
            </el-select>
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
      editTable: {},
      editRoles: [],
      roles: {},
      pageSize: 10,
    }
  },
  mounted() {
    this.datas();
  },
  methods: {
    async datas(filter, val) {
      api.article.get_articles({ params: { filter: filter, paginate: this.pageSize, page: val } }).then((res) => {
        var res = res.data.data;
        this.tableData = [...res.data];
        this.total = Number(res.total);
        console.log(this.tableData);
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
    edit(index, id) {
      this.editTable = {};
      this.id = id;
      this.index = index;
      this.dialogTitle = "编辑用户";
      this.isAdd = false;
      api.manage.get_roles().then((res) => {
        this.roles = res.data.data.data;
      })
      api.manage.get_user(this.id).then((res) => {
        this.editRoles = res.data.data;
        this.showEdit = true;
      })
    },
    del(index, id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.manage.delete_user(id).then((res) => {
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
      api.manage.edit_user(this.id, { roles: this.editRoles }).then((res) => {
        if (res.data.status == 0) {
          this.messageType = "error"
        } else {
          this.messageType = "success"
          //this.tableData.splice(this.index, 1, res.data.data);
          this.datas();
          this.load = false, this.showEdit = false
        }
        this.$message({
          message: res.data.message,
          type: this.messageType
        });
      })
    },
    cancel() {
      this.editTable = {};
      this.showEdit = false;
      this.load = false
    },
    submit() {
      this.datas(this.searchform.name)
    },
    handerUpdate(index, id) {
      if (!this.tableData[index].edit) {
        api.manage.edit_user(id, { is_confirmed: this.tableData[index].is_confirmed, is_banned: this.tableData[index].is_banned })
      }
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
  .searchInput {
    float: left;
    width: 40%;
    padding-right: 20px;
  }
  .pagination {
    padding-top: 15px;
    text-align: right;
  }
  .link-type {
    text-align: left;
  }
}
</style>
