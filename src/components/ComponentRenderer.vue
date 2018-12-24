<template>
    <component
            :key="index"
            :is="componentData.component"
            :class="{'edit-mode': !previewMode}"
            @click.native.stop="componentClick(componentData.component, index);"
            v-bind="componentData.props"
    >
        <template v-if="previewMode === false">
            <draggable
                    v-for="slotName in componentData.slots"
                    :key="slotName"
                    class="slot-box"
                    :class="`slot-box--${slotName}`"
                    :options="dragOptions"
                    v-model="componentData.children"
                    :slot="slotName"
            >
                <div v-if="componentData.children.length === 0">{{ slotName }}</div>

                <component-renderer
                        v-for="(child, index) in componentData.children"
                        :drag-options="dragOptions"
                        :component-data="child"
                        :index="index"
                        :preview-mode="previewMode"
                        :slot="child.slot || 'default'"
                        @component-click="componentClick"
                        :key="index">
                </component-renderer>
            </draggable>
        </template>
        <template v-else>
            <component-renderer
                    v-for="(child, index) in componentData.children"
                    :drag-options="dragOptions"
                    :component-data="child"
                    :index="index"
                    :preview-mode="previewMode"
                    :slot="child.slot || 'default'"
                    @component-click="componentClick"
                    :key="index">
            </component-renderer>
            <span v-if="componentData.children.length === 0" contenteditable="true" @blur="(evt) => onContentChange(evt)">
                {{content}}
            </span>
        </template>
    </component>
</template>
<script>
  import Draggable from "vuedraggable";

  export default {
    name: "component-renderer",
    components: {
      Draggable
    },
    props: {
      componentData: {
        type: Object,
        default: () => ({})
      },
      dragOptions: {
        type: Object,
        default: () => ({})
      },
      index: {
        type: Number,
        default: 0
      },
      previewMode: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hovered: false,
      }
    },
    computed: {
      content() {
        return this.componentData.content || this.componentData.component;
      }
    },
    methods: {
      componentClick(component, index) {
        this.$emit("component-click", component, index);
      },
      onContentChange(evt) {
        this.componentData.content = evt.target.innerText;
      }
    }
  };
</script>
<style lang="scss">
    .slot-box {
        border: 1px dashed #ebeef5;
        min-height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .el-col,
    .el-row,
    .el-card,
    .el-form{
        .slot-box.slot-box--default {
            min-height: 150px;
        }
    }

    .el-row {
        min-height: 100px;
        width: 100%;
        border: 1px solid #ebeef5;
    }

    .el-col {
        min-height: 100px;
        min-width: 50px;
        border: 1px solid #ebeef5;
    }

    .edit-mode .el-col {
        width: 50px !important;
    }
</style>
