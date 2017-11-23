import Vue from 'vue';

export default {
  get_articles: {
    permission: 'articles.index',
    request: (params) => {
      return Vue.http.get('articles', params);
    }
  },
  get_article: {
    permission: 'articles.show',
    request: (id) => {
      return Vue.http.get('articles/' + id);
    }
  },
  create_article: {
    permission: 'articles.store',
    request: (params) => {
      return Vue.http.post('articles', params);
    }
  },
  edit_article: {
    permission: 'articles.update',
    request: (id, params) => {
      return Vue.http.patch('articles/' + id, params);
    }
  },
  delete_article: {
    permission: 'articles.destroy',
    request: (id) => {
      return Vue.http.delete('articles/' + id);
    }
  },
  get_tags: {
    permission: 'tags.index',
    request: () => {
      return Vue.http.get('tags');
    }
  },
  get_categories: {
    permission: 'categories.index',
    request: () => {
      return Vue.http.get('categories');
    }
  },
}
