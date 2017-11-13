import Vue from 'vue';

export default {
  get_articles: {
    permission: 'articles.index',
    request: () => {
      return Vue.http.get('articles');
    }
  }
}
