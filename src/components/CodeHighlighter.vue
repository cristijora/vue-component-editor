<template>
    <div class="container">
        <el-button size="small"
                   class="copy-btn"
                   v-clipboard:copy="code">
            Copy
        </el-button>
        <prism language="html" contenteditable="true" @input="onContentChange">{{ code }}</prism>
        <div id="preview"></div>
    </div>
</template>

<script>
  import 'prismjs'
  import 'prismjs/themes/prism.css'
  import Prism from 'vue-prism-component'
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  Vue.use(VueClipboard)
  export default {
    name: 'code-highlighter',
    components: {
      Prism
    },
    props: {
      code: String
    },
    model: {
      prop: 'code',
      event: 'change'
    },
    data() {
      return {
        manager: null
      }
    },
    methods: {
      onContentChange(evt) {
        this.$emit('change', evt.target.innerText);
      }
    }
  }
</script>

<style scoped>
    .container {
        position: relative;
    }

    .copy-btn {
        position: absolute;
        right: 10px;
        top: 10px;
    }

</style>
