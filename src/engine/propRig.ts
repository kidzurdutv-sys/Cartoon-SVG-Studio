import { type PropRigData } from '../types';

export const createProp = (svgString: string, x: number, y: number): PropRigData => {
  const id = `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Clean up SVG string to remove wrapper <svg> tags so it can be embedded easily
  let innerSVG = svgString;
  const match = svgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (match && match[1]) {
    innerSVG = match[1];
  }

  // Ensure it has a root group wrapper for manipulation
  if (!innerSVG.trim().startsWith('<g id="prop-root"')) {
     innerSVG = `<g id="prop-root">${innerSVG}</g>`;
  }

  return {
    propId: id,
    svg: innerSVG,
    transform: { x, y, rotation: 0, scale: 1 },
    draggable: true,
    resizable: true
  };
};

export const updatePropTransform = (propId: string, transform: Partial<PropRigData['transform']>, currentProps: PropRigData[]): PropRigData[] => {
  return currentProps.map(prop => {
    if (prop.propId === propId) {
      return {
        ...prop,
        transform: { ...prop.transform, ...transform }
      };
    }
    return prop;
  });
};

export const serializeProps = (props: PropRigData[]): string => {
  return props.map(prop => {
    const { x, y, rotation, scale } = prop.transform;
    const transformStr = `translate(${x} ${y}) rotate(${rotation}) scale(${scale})`;
    return `<g id="${prop.propId}" transform="${transformStr}">${prop.svg}</g>`;
  }).join('\n');
};
