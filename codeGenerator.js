export function generateCode(ast, level = 0) {
  if (!ast) return '';
  let children = ast.map(elm => {
    let propsString = '';
    for (let propKey in elm.props) {
      let propValue = elm.props[propKey];
      if (!propValue) {
        continue;
      }
      if (typeof propValue === 'boolean' || typeof propValue === 'number') {
        if (propValue) {
          propsString += ` :${propKey}="${propValue}"`;
        }
      } else {
        propsString += ` ${propKey}="${propValue}"`;
      }
    }
    let children = generateCode(elm.children, level+1) || elm.content;
    if (children) {
      return `<${elm.component}${propsString}>
  ${children}
</${elm.component}>\n`
    }
    return `<${elm.component}${propsString}><${elm.component}>`
  });
  let result = children.join('');

  if (ast.length > 1 && level === 0) {
    return `<div>
${result}
</div>`
  }
  return result;
}
