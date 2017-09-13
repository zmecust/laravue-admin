<template>
  <el-menu mode="vertical" theme="dark" unique-opened :default-active="$route.path" :collapse="isCollapse">
    <sidebar-item :routes='permission_routers'></sidebar-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    isCollapse() {
      return !this.sidebar.opened
    },
    permission_routers() {
      return this.$store.state.app.permission_routers  
    },
    sidebar() {
      return this.$store.state.app.sidebar
    }
  }
}
</script>
