import { type EnvironmentRigData, type EnvLayer } from '../types';

export const parseEnvironmentSVG = (svgString: string): EnvironmentRigData => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');

  const layers: EnvLayer[] = [];
  const layerIds = ['layer-sky', 'layer-far', 'layer-mid', 'layer-near'];
  const parallaxFactors = [0.1, 0.3, 0.6, 1.0];

  layerIds.forEach((id, index) => {
    const el = doc.getElementById(id);
    if (el) {
      layers.push({
        id,
        name: id.replace('layer-', '').toUpperCase(),
        svgContent: el.outerHTML,
        parallax: parallaxFactors[index],
        zOrder: index
      });
    }
  });

  // Fallback if AI didn't follow exact IDs
  if (layers.length === 0) {
    const groups = Array.from(doc.querySelectorAll('g'));
    groups.slice(0, 4).forEach((el, index) => {
      layers.push({
        id: el.id || `layer-${index}`,
        name: el.id || `LAYER ${index}`,
        svgContent: el.outerHTML,
        parallax: parallaxFactors[index] || 1,
        zOrder: index
      });
    });
  }

  // If completely raw shapes with no groups
  if (layers.length === 0) {
    layers.push({
      id: 'layer-base',
      name: 'BASE',
      svgContent: doc.documentElement.innerHTML, // Grab everything inside <svg>
      parallax: 1.0,
      zOrder: 0
    });
  }

  return { layers, parallaxFactors };
};

export const applyParallax = (rigData: EnvironmentRigData, cameraX: number, cameraY: number): string => {
  // Reconstruct SVG with transforms applied
  let composedSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512" width="100%" height="100%">';

  const sortedLayers = [...rigData.layers].sort((a, b) => a.zOrder - b.zOrder);

  sortedLayers.forEach(layer => {
    const offsetX = cameraX * layer.parallax;
    const offsetY = cameraY * (layer.parallax * 0.5); // Less vertical parallax

    // Inject transform into the root group of this layer
    const transformedContent = layer.svgContent.replace(
      /^<g([^>]*)>/i,
      `<g$1 transform="translate(${offsetX}, ${offsetY})">`
    );

    // Fallback if no <g> at root (happens if we took doc.documentElement.innerHTML)
    if (transformedContent === layer.svgContent && !layer.svgContent.trim().startsWith('<g')) {
        composedSVG += `<g transform="translate(${offsetX}, ${offsetY})">${layer.svgContent}</g>`;
    } else {
        composedSVG += transformedContent;
    }
  });

  composedSVG += '</svg>';
  return composedSVG;
};
