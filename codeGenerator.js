export function generateCode(ast) {
  if(!ast) return '';
  let children = ast.map(elm => {
    let propsString = '';
    for (let propKey in elm.props) {
      let propValue = elm.props[propKey];
      if(!propValue){
        continue;
      }
      if(typeof propValue === 'boolean' || typeof propValue === 'number') {
        if(propValue) {
          propsString += ` :${propKey}="${propValue}"`;
        }
      } else {
        propsString += ` ${propKey}="${propValue}"`;
      }
    }
    return `
<${elm.component}${propsString}>${generateCode(ast.children)}<${elm.component}>`
});
  return children.join('');
}
