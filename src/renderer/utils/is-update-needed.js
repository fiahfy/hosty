function isEqualObject(a, b) {
  const newA = Object.assign({}, a);
  const newB = Object.assign({}, b);
  delete newA.children;
  delete newB.children;
  return JSON.stringify(newA) === JSON.stringify(newB);
}

export default function isUpdateNeeded(component, nextProps, nextState, nextContext) {
  return !(
    isEqualObject(component.props, nextProps)
      && isEqualObject(component.state, nextState)
      && isEqualObject(component.context, nextContext)
  );
}
