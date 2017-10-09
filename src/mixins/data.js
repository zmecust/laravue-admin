//公共data数据
export default {
  data() {
    return {
      dialogTitle: '',
      rules: {},
      tableData: [],
      total: 0,
      listWidth: true,
      align: "center",
      showEdit: false,
      isAdd: false,
      id: 0,
      index: '',
      pageSize: 15,
      pageSizes: [5, 10, 15, 20],
      load: false,
      searchform: {
        name: '',
        state: ''
      },
      messageType: null,
    }
  }
}