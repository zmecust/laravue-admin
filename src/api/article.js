import Vue from 'vue';

export default {
  get_articles: {
    permission: 'articles.index',
    request: (params) => {
      return Vue.http.get('articles', params);
    }
  },
  create_article: {
    permission: 'articles.store',
    request: (params) => {
      return Vue.http.post('articles', params);
    }
  }
}
