const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
}
export default getters