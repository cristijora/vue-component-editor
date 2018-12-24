<template>
    <el-select :value="value" @change="val => $emit('change', val)">
        <el-option v-for="val in values" :key="val" :label="val" :value="val"></el-option>
    </el-select>
</template>

<script>
  export default {
    name: 'value-select',
    props: {
      values: {
        type: Array,
        default: () => []
      },
      value: [String, Number]
    },
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>

<style scoped>

</style>
