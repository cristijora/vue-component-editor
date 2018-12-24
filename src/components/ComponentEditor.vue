<template>
  <div class="component-editor">
    <el-form>
      <h5>Settings</h5>
      <el-form-item
              v-for="(prop, key) in componentSettings"
              :label="key"
              :key="key"
      >
        <component :is="mappings[prop.type]" v-model="settingsConfig[key]"> </component>
      </el-form-item>
      <hr>
      <h5>Props</h5>
      <el-form-item
        v-for="(prop, key) in componentProps"
        :label="key"
        :key="key"
      >
        <component :is="mappings[prop.type]" v-model="propsConfig[key]"> </component>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "component-editor",
  props: {
    componentProps: {
      type: Object,
      default: () => ({})
    },
    componentSettings: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      mappings: {
        String: "el-input",
        Boolean: "el-switch",
        Number: "el-input-number",
        default: "el-input"
      },
      propsConfig: {},
      settingsConfig: {},
    };
  },
  watch: {
    propsConfig: {
      deep: true,
      handler(newValue) {
        this.$emit("props-change", newValue);
      }
    },
    settingsConfig: {
      deep: true,
      handler(newValue) {
        this.$emit("settings-change", newValue);
      }
    }
  }
};
</script>
<style lang="scss">
.component-editor {
  padding: 10px;
  .el-form .el-form-item {
    margin-bottom: 0;
  }
  .el-form .el-form-item__label {
    line-height: 25px;
  }
}
</style>
