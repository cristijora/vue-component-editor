<template>
    <prism language="html">{{ code }}</prism>
</template>

<script>
  import 'prismjs'
  import 'prismjs/themes/prism.css'
  import Prism from 'vue-prism-component'
  export default {
    name: 'code-higlighter',
    components: {
      Prism
    },
    props: {
      code: String
    }
  }
</script>

<style scoped>

</style>
