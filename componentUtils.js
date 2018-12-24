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
    let propType = props[key].type;
    let propTypeName = "";
    if (typeof propType === "function") {
      propTypeName = propType.name;
    } else if (Array.isArray(propType)) {
      propTypeName = propType[0].name;
    }
    finalProps[key] = {
      type: propTypeName,
      default: props[key].default,
      value: ""
    };
  }
  return {
    props: finalProps,
    settings: extraProps
  };
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
let predefinedComponents = ['ElButton', 'ElCard', 'ElInput', 'ElInputNumber', 'ElRow', 'ElCol'];
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
      componentArray.push({
        component: name,
        props: {},
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
