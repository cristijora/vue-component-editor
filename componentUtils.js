import camelCase from "lodash/camelCase";

export function getInstance(compName) {
  return new compName();
}

const extraProps = {
  showSlots: {
    type: 'Boolean',
    default: false
  }
};

export function extractProps(comp) {
  let instance = getInstance(comp);
  let props = instance.$options.props;
  let finalProps = {};
  for (let key in props) {
    let propData = props[key];
    let propType = propData.type
    let propTypeName = "";
    if (typeof propType === "function") {
      propTypeName = propType.name;
    } else if (Array.isArray(propType)) {
      propTypeName = propType[0].name;
    }
    let values = extractPropValues(propData);
    finalProps[key] = {
      ...propData,
      type: propTypeName,
      value: "",
      values
    };
  }
  return {
    props: finalProps,
    settings: extraProps
  };
}

let propValuesRegex = /(\[.+\])/g;
function extractPropValues(propData) {
  let values;
  if(propData.validator) {
    let validatorString = propData.validator.toString();
    let valueMatches = getMatches(validatorString, propValuesRegex, 1);
    if(valueMatches.length) {
      let strValue = valueMatches[0];
      strValue = strValue.replace(/'/g, "\"")
      values = JSON.parse(strValue);
    }
  }
  return values;
}

let slotRegex = /_t\("([^".]+)"\)/g;
let slotRegex2 = /this.\$slots.(.+)\)/g;
export function extractSlots(comp) {
  let instance = getInstance(comp);
  let renderString = instance.$options.render.toString();
  let slotMatches = getMatches(renderString, slotRegex, 1);
  if (slotMatches.length === 0) {
    slotMatches = getMatches(renderString, slotRegex2, 1);
  }
  return slotMatches;
}

function getMatches(string, regex, index) {
  index || (index = 1); // default to the first capturing group
  var matches = [];
  var match;
  while ((match = regex.exec(string))) {
    matches.push(match[index]);
  }
  return matches;
}

let componentExceptions = ['RouterLink', 'RouterView', 'ElDropdownMenu'];
let predefinedComponents = ['ElButton', 'ElCard', 'ElInput', 'ElInputNumber', 'ElRow', 'ElCol', 'ElProgress', 'ElBadge', 'ElTooltip', 'ElRate', 'ElDatePicker', 'ElTimePicker', 'ElTimeSelect', 'ElForm', 'ElFormItem'];
export function getGlobalComponents(self) {
  let components = self.$root.$options.components;
  let componentArray = [];
  try {
    for(let name in components) {
      if(!predefinedComponents.includes(name)) {
        continue;
      }
      let component = components[name];
      let slots = extractSlots(component);
      let {props} = extractProps(component);
      let requiredProps = {};
      for(let propName in props) {
        let propData = props[propName];
        if(propData.required){
          requiredProps[propName] = propData.default;
        }
      }
      componentArray.push({
        component: name,
        props: requiredProps,
        children: [],
        content: name,
        slots
      })
    }
    return componentArray;
  } catch(e) {
    return componentArray;
  }
}
