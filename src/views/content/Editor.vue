<template>
  <div class="editor" v-cloak>
    <el-row :gutter="20">
      <el-col :span="18">
        <div id="editor-md" style="width: 100%">
          <textarea id="body" name="body" style="display:none">{{ params.body }}</textarea>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="title">
          <p>文章 title：</p>
          <el-input class="el-input" v-model="params.title" placeholder="文章 title"></el-input>
          <p>文章类别：</p>
          <el-select class="el-input" v-model="params.category" placeholder="请选择文章类别">
            <el-option v-for="item in allCategories" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <p>文章标签：</p>
          <el-select class="el-input" v-model="tags" multiple filterable allow-create placeholder="请选择文章标签">
            <el-option v-for="item in allTags" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <p>是否隐藏：</p>
          <el-select class="el-input" v-model="params.is_hidden" placeholder="是否隐藏">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <p>插入封面：</p>
          <el-upload class="upload-demo" drag :action="upload_url" :show-file-list="false" :on-success="handleAvatarSuccess" :headers="headers">
            <img v-if="params.article_url" :src="params.article_url" class="avatar" style="width: 100%">
            <i v-else class="el-icon-upload"></i>
            <div v-if="! params.article_url" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <div style="display: flex; padding: 20px 0 20px 0">
            <el-button v-on:click="cancel">取 消</el-button>
            <el-button type="primary" v-on:click="save">保 存</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import $script from 'scriptjs';
import store from '../../store';
import api from '../../api';
const accessToken = store.state.account.auth.access_token;

export default {
  data() {
    return {
      editorPath: '../../../static/markdown/',
      params: {
        title: '',
        body: '',
        category: '',
        is_hidden: '',
        article_url: ''
      },
      upload_url: this.$http.options.root + '/article_image',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      options: [
        { value: 'F', label: '是' },
        { value: 'T', label: '否' }
      ],
      failure: '',
      tags: [],
      allTags: '',
      allCategories: '',
    }
  },
  mounted() {
    if (window.location.hash.split('#')[2] == 'create') {
      api.article.get_tags.request().then((res) => {
        this.allTags = res.data.data;
      });
      api.article.get_categories.request().then((res) => {
        this.allCategories = res.data.data;
      });
      $script(
        [`${this.editorPath}js/jquery.min.js`], () => {
          $script(`${this.editorPath}js/editormd.min.js`, () => {
            this.initEditor();
          });
        }
      )
    } else {
      api.article.get_tags.request().then((res) => {
        this.allTags = res.data.data;
        api.article.get_categories.request().then((res) => {
          this.allCategories = res.data.data;
          api.article.get_article.request(window.location.hash.split('/')[3]).then((res) => {
            for (let index in res.data.data.tags) {
              this.tags.push(res.data.data.tags[index].id);
            }
            this.params = res.data.data;
            this.params.category = res.data.data.category_id;
            $script(
              [`${this.editorPath}js/jquery.min.js`], () => {
                $script(`${this.editorPath}js/editormd.min.js`, () => {
                  this.initEditor();
                });
              }
            )
          });
        });
      });
    }
  },
  methods: {
    initEditor() {
      this.$nextTick((editorMD = window.editormd) => {
        if (editorMD) {
          editorMD("editor-md", {
            width: "100%",
            height: '90vh',
            markdown: "",
            path: `${this.editorPath}lib/`,
            toolbarIcons: function() {
              return ["undo", "redo", "|", "bold", "del", "italic", "quote", "ucwords", "uppercase", "lowercase", "|",
                "h1", "h2", "h3", "h4", "h5", "h6", "|", "list-ul", "list-ol", "hr", "|", "link", "reference-link",
                "image", "code", "preformatted-text", "code-block", "table", "datetime", "emoji", "html-entities",
                "pagebreak", "||", "goto-line", "watch", "clear", "preview", "fullscreen"]
            },
            imageUpload: true,
            imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
            imageUploadURL: "https://api.laravue.org/api/v1/markdown/upload",
            emoji: true
          });
        }
      });
    },
    handleAvatarSuccess(response, file, fileList) {
      if (1 == response.status) {
        this.params.article_url = response.data.url;
      }
    },
    save() {
      if (window.location.hash.split('#')[2] == 'create') {
        this.params.tag = this.tags;
        api.article.create_article.request(this.params).then((res) => {
          if (res.data.status == 1) {
            this.messageType = "success"
            this.$router.go(-1);   
          } else {
            this.messageType = "error"
          }
        });
      } else {
        let form = {
          tag: this.tags,
          is_hidden: this.params.is_hidden,
          title: this.params.title,
          body: document.getElementById('editor-md').value,
          category: this.params.category,
          article_url: this.params.article_url
        }
        api.article.edit_article.request(window.location.hash.split('/')[3], form).then((res) => {
          if (res.data.status == 1) {
            this.messageType = "success"
            this.$router.go(-1);
          } else {
            this.messageType = "error"
          }
        });
      }
      this.$message({
        message: res.data.message,
        type: this.messageType
      });
    },
    cancel() {
      this.$router.go(-1);
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../../static/markdown/css/editormd.min.css";

[v-cloak] {
  display: none;
}

.editor {
  padding: 20px 20px 0 20px;
}

.title {
  border: 1px solid #ddd;
  padding: 10px 10px 0 10px;
  p {
    color: #555;
  }
}
</style>
