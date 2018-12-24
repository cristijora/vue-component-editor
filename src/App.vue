<template>
    <div id="app">
        <div class="editor-container">
            <div class="components-area">
                <h5>Components</h5>
                <component-list v-model="allComponents" @drag-start="onDragStart" @drag-end="onDragEnd"></component-list>
            </div>

            <div class="render-area">
                <h5>Render Area</h5>
                <el-switch active-text="Preview" inactive-text="Edit" v-model="previewMode"></el-switch>
                <hr>
                <draggable
                        :value="componentsToRender"
                        @start="onDragStart"
                        @end="onDragEnd"
                        @change="handleComponentsToRender"
                        class="rendered-components"
                        :options="dragOptions"
                >
                    <component-renderer
                            class="draggable-component"
                            v-for="(comp, index) in componentTree"
                            :component-data="comp"
                            :drag-options="dragOptions"
                            :index="index"
                            :preview-mode="previewMode"
                            :key="index"
                            @component-click="componentClick"
                    >
                    </component-renderer>
                </draggable>
            </div>
            <div class="edit-area">
                <component-editor
                        :key="selectedComponentIndex"
                        :componentProps="selectedComponent.props"
                        :component-settings="selectedComponent.settings"
                        @props-change="syncProps"
                        @settings-change="syncExtraProps"
                >
                </component-editor>
            </div>
        </div>

        <div class="json-container">
            <h5>Code</h5>
            <code-highlighter v-model="generatedCode">

            </code-highlighter>
        </div>
    </div>
</template>

<script>
  import Draggable from "vuedraggable";
  import { extractProps, getGlobalComponents } from "../componentUtils";
  import deepClone from "lodash/cloneDeep";
  import ComponentList from "./components/ComponentList";
  import ComponentEditor from "./components/ComponentEditor";
  import ComponentRenderer from "./components/ComponentRenderer";
  import CodeHighlighter from "./components/CodeHighlighter";
  import { generateCode } from '../codeGenerator';
  import {compile} from 'vue-template-compiler';

  export default {
    name: "App",
    components: {
      Draggable,
      ComponentList,
      ComponentEditor,
      ComponentRenderer,
      CodeHighlighter
    },
    data() {
      return {
        selectedComponentIndex: 0,
        previewMode: false,
        selectedComponent: {
          props: {},
          slots: []
        },
        componentTree: [],
        allComponents: [
          {
            component: "el-button",
            props: {
              type: "primary"
            },
            content: 'Button',
            children: []
          },
          {
            component: "el-switch",
            children: [],
          },
          {
            component: "el-card",
            content: "card",
            children: [],
          },
          {
            component: "el-input",
            props: {
              value: "Input Value"
            },
            children: []
          },
          {
            component: "el-row",
            content: "row",
            children: []
          },
          {
            component: "el-col",
            content: "col",
            children: []
          },
          {
            component: "el-form",
            props: {
              class: "demo-form"
            },
            children: [
              {
                component: "el-form-item",
                props: {
                  label: "Input label"
                },
                children: [
                  {
                    component: "el-input",
                    props: {
                      value: "Test"
                    },
                    children: []
                  }
                ]
              }
            ]
          }
        ],
        componentsToRender: []
      };
    },
    computed: {
      dragOptions() {
        return {
          draggable: ".draggable-component",
          group: "components",
          ghostClass: "draggable-component--ghost",
          chosenClass: "draggable-component--chosen"
        };
      },
      generatedCode: {
        get() {
          return generateCode(this.componentTree);
        },
        set(value) {
          let result = compile(value);
          console.log(result);
        }
      }
    },
    mounted() {
      this.allComponents = getGlobalComponents(this);
    },
    methods: {
      onDragStart() {
        this.previewMode = false;
      },
      onDragEnd() {
        this.previewMode = true;
      },
      syncProps(newValue) {
        this.componentTree[this.selectedComponentIndex].props = newValue;
      },
      syncExtraProps(newValue) {
        this.componentTree[this.selectedComponentIndex].settings = newValue;
      },
      handleComponentsToRender(evt) {
        let {added} = evt;
        if(added) {
          let {element, newIndex} = added;
          this.componentTree.splice(newIndex, 0, deepClone(element));
        }
      },
      componentClick(compName, index) {
        let component = this.$root.$options.components[compName];
        let {props, settings} = extractProps(component);
        this.selectedComponent.props = props;
        this.selectedComponent.settings = settings;
        this.selectedComponentIndex = index;
      }
    }
  };
</script>

<style>
    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .editor-container {
        display: flex;
    }

    .render-area,
    .components-area,
    .edit-area {
        flex: 1;
        border: 1px solid #ebeef5;
        min-height: 70vh;
        max-height: 70vh;
        overflow: auto;
    }

    .render-area {
        flex: 2;
    }

    .json-container {
        min-height: 30vh;
    }

    .placeholder-components {
        display: flex;
        flex-direction: column;
    }

    .rendered-components {
        height: 100%;
    }
</style>
