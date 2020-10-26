<template>
  <iframe
    :src="iframeSrc"
    frameborder="no"
    style="width: 100%;height: 100%"
    scrolling="auto"
  ></iframe>
</template>

<script>
import IframeCom from '@/components/Iframe'
import UrlSearchParams from 'url-search-params'

export default {
  computed: {
    iframeSrc() {
      const { path, ...queryItem } = this.$route.query
      let queryString = {
        token: localStorage.getItem('token')
      };
      Object.assign(queryString, queryItem)
      queryString = new UrlSearchParams(queryString)
      return `${path}?${queryString}`
    }
  }
}
</script>
