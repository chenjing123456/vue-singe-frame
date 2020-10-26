<template>
  <router-view :key="key" />
</template>

<script>
export default {
  name: 'DataType',
  computed: {
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="less">

</style>
