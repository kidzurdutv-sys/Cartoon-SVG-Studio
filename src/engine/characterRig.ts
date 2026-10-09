import { type CharacterRigData, type Bone, type Joint, type Constraint } from '../types';

export const autoRigCharacter = (svgString: string): CharacterRigData => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');

  const bones: Bone[] = [];
  const joints: Joint[] = [];
  const constraints: Constraint[] = [];

  // Expected rigid skeleton structure based on the new rigorous prompt
  const structure: Record<string, string | null> = {
    'rig-torso': null, // Root
    'rig-head': 'rig-torso',
    'rig-armL': 'rig-torso',
    'rig-armR': 'rig-torso',
    'rig-legL': 'rig-torso',
    'rig-legR': 'rig-torso'
  };

  const getBBoxSafe = (el: SVGGElement) => {
    try {
      if (typeof el.getBBox === 'function') {
        return el.getBBox();
      }
    } catch {
      // Ignored
    }
    return { x: 256, y: 256, width: 50, height: 50 }; // Ultimate fallback
  };

  // We look for elements matching our known rigid structure
  Object.keys(structure).forEach((groupId) => {
    const el = doc.getElementById(groupId) as unknown as SVGGElement;
    if (el) {
      const parentId = structure[groupId];
      const boneId = groupId.replace('rig-', 'bone-');

      let originX = 256;
      let originY = 256;

      // Extract precise pivot coordinates if the AI provided them via data-pivot="x,y"
      const pivotAttr = el.getAttribute('data-pivot');
      if (pivotAttr) {
        const parts = pivotAttr.split(',');
        if (parts.length === 2) {
          originX = parseFloat(parts[0]);
          originY = parseFloat(parts[1]);
        }
      } else {
        // Fallback: Try to calculate from BBox center
        const bbox = getBBoxSafe(el);
        originX = bbox.x + bbox.width / 2;
        originY = bbox.y + bbox.height / 2;

        // Manual logical overrides if AI forgot pivot
        if (groupId === 'rig-head') originY = bbox.y + bbox.height; // Neck joint
        if (groupId.startsWith('rig-arm')) originY = bbox.y + 20; // Shoulder
        if (groupId.startsWith('rig-leg')) originY = bbox.y + 10; // Hip
      }

      bones.push({
        id: boneId,
        parentId: parentId ? parentId.replace('rig-', 'bone-') : null,
        name: groupId,
        restAngle: 0,
        length: 100, // Visual representation length
        origin: { x: originX, y: originY }
      });

      if (parentId) {
        joints.push({
          id: `joint-${groupId}`,
          boneId: boneId,
          position: { x: originX, y: originY },
          type: 'rotate',
          limits: { min: -180, max: 180 }
        });
      }
    }
  });

  return { bones, joints, constraints };
};

export const getBoneTransform = (boneId: string, rigData: CharacterRigData, keyframeValues: Record<string, number>): string => {
  const bone = rigData.bones.find(b => b.id === boneId);
  if (!bone) return '';

  const rotation = keyframeValues[boneId] || 0;
  if (rotation === 0) return '';

  return `rotate(${rotation}, ${bone.origin.x}, ${bone.origin.y})`;
};

export const validateRig = (rigData: CharacterRigData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!rigData || rigData.bones.length === 0) {
    return { valid: false, errors: ['No rig data provided / No groups detected.'] };
  }

  const rootBones = rigData.bones.filter(b => b.parentId === null);
  if (rootBones.length === 0) {
    errors.push('No root bone found (usually rig-torso).');
  } else if (rootBones.length > 1) {
    errors.push('Multiple root bones found.');
  }

  const requiredParts = ['bone-head', 'bone-torso', 'bone-armL', 'bone-armR', 'bone-legL', 'bone-legR'];
  requiredParts.forEach(part => {
    if (!rigData.bones.some(b => b.id === part)) {
      errors.push(`Missing required bone/group: ${part.replace('bone-', 'rig-')}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};
