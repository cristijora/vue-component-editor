<template>
    <draggable
            v-model="allComponents"
            class="placeholder-components"
            @start="onDragStart"
            @end="onDragEnd"
            :options="dragOptionsInitial"
    >
        <div v-for="(comp, index) in allComponents"
             class="component-preview"
             :key="index">
            <div>{{comp.component}}</div>
            <component :is="comp.component"
                        v-bind="comp.props">
                <span v-html="comp.component"></span>
            </component>
        </div>
    </draggable>

</template>
<script>
  import Draggable from 'vuedraggable'

  export default {
    name: 'component-list',
    components: {
      Draggable
    },
    props: {
      value: {
        type: Array,
        default: () => []
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {
        allComponents: []
      }
    },
    computed: {
      dragOptionsInitial() {
        return {
          draggable: ".component-preview",
          group: { name: "components", pull: "clone", put: false },
          ghostClass: "component-preview--ghost",
          chosenClass: "component-preview--chosen"
        };
      }
    },
    methods: {
      onDragStart(evt) {
        this.$emit('drag-start')
      },
      onDragEnd(evt) {
        this.$emit('drag-end')
      }
    },
    created() {
      this.$watch('value', newVal => {
        this.allComponents = newVal;
      }, { immediate: true });
      this.$watch('allComponents', newVal => {
        this.$emit('change', newVal);
      })
    }
  }
</script>
<style>
    .component-preview {
        min-height: 50px;
        margin-bottom: 10px;
        border: 1px dashed #ebeef5;
        padding: 5px;
        transition: transform .2s;
    }
</style>
