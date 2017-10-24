import Vue from 'vue';

export default {
  get_articles() {
    return Vue.http.get('articles');
  }
}