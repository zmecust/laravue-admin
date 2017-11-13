const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  button_permission: state => state.account.button_permission,
}
export default getters