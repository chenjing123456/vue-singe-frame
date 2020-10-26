const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  userInfo: state => state.user.userInfo,
  entFileTabs: state => state.user.entFileTabs,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes, // 菜单列表
  appHeaderRoutes: state => state.permission.appHeaderRoutes,
  currentRoute: state => state.permission.currentRoute,
  currentPath: state => state.permission.currentPath,
  addRoutes: state => state.permission.addRoutes,
  errorLogs: state => state.errorLog.logs,
  nacosServer: state => state.api.nacosServer,
  sentinelDashboard: state => state.api.sentinelDashboard,
  mossServer: state => state.api.mossServer,
  swaggerApi: state => state.api.swaggerApi

}
export default getters
