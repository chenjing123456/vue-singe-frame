<template>
  <router-view :key="key" />
</template>

<script>
export default {
  name: 'Role',
  computed: {
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="less">

</style>
