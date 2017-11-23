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
      <el-button @click="add()" icon="plus" type="primary" class="add" v-has="has(create_article)">创建文章</el-button>
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
            <el-button @click="edit(scope.$index, scope.row.id)" size="small" icon="edit" v-has="has(edit_article)">编辑</el-button>
            <el-button size="small" type="danger" @click="del(scope.$index, scope.row.id)" icon="delete" v-has="has(delete_article)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination layout="sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="total" :page-size="pageSize" :page-sizes="pageSizes">
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
      create_article: api.article.create_article,
      edit_article: api.article.edit_article,
      delete_article: api.article.delete_article,
    }
  },
  mounted() {
    this.datas();
  },
  methods: {
    async datas(filter, val) {
      api.article.get_articles.request({ params: { filter: filter, paginate: this.pageSize, page: val } }).then((res) => {
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
    add() {
      this.$router.push('/articles/editor#create');
    },
    edit(index, id) {
      this.$router.push('/articles/editor#edit/' + id);
    },
    del(index, id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.article.delete_article.request(id).then((res) => {
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
