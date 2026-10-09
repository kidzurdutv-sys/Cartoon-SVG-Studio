import { type CharacterRigData, type Bone, type Joint, type Constraint } from '../types';

export const autoRigCharacter = (svgString: string): CharacterRigData => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const rigGroups = doc.querySelectorAll('g[data-rig="true"]');

  const bones: Bone[] = [];
  const joints: Joint[] = [];
  const constraints: Constraint[] = [];

  // Skeleton structure definition
  const structure: Record<string, string | null> = {
    'body': null, // Root
    'head': 'body',
    'left-arm': 'body',
    'right-arm': 'body',
    'left-hand': 'left-arm',
    'right-hand': 'right-arm',
    'left-leg': 'body',
    'right-leg': 'body',
    'left-foot': 'left-leg',
    'right-foot': 'right-leg'
  };

    rigGroups.forEach((g) => {
    const id = g.id;
    if (structure[id] !== undefined) {
      // Mock origin calculations based on part ID for standard humanoid
      let originX = 256;
      let originY = 256;

      if (id === 'head') { originY = 150; }
      if (id === 'left-arm') { originX = 180; originY = 220; }
      if (id === 'right-arm') { originX = 330; originY = 220; }
      if (id === 'left-leg') { originX = 220; originY = 350; }
      if (id === 'right-leg') { originX = 290; originY = 350; }
      if (id === 'left-hand') { originX = 180; originY = 320; }
      if (id === 'right-hand') { originX = 330; originY = 320; }
      if (id === 'left-foot') { originX = 220; originY = 450; }
      if (id === 'right-foot') { originX = 290; originY = 450; }

      const parentId = structure[id];
      const boneId = `bone-${id}`;

      bones.push({
        id: boneId,
        parentId: parentId ? `bone-${parentId}` : null,
        name: id,
        restAngle: 0,
        length: 100, // simplified mock
        origin: { x: originX, y: originY }
      });

      if (parentId) {
        joints.push({
          id: `joint-${id}`,
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
  return `rotate(${rotation}, ${bone.origin.x}, ${bone.origin.y})`;
};

export const validateRig = (rigData: CharacterRigData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!rigData) {
    return { valid: false, errors: ['No rig data provided'] };
  }

  const rootBones = rigData.bones.filter(b => b.parentId === null);
  if (rootBones.length === 0) {
    errors.push('No root bone found (usually body).');
  } else if (rootBones.length > 1) {
    errors.push('Multiple root bones found.');
  }

  const requiredParts = ['bone-head', 'bone-body', 'bone-left-arm', 'bone-right-arm', 'bone-left-leg', 'bone-right-leg'];
  requiredParts.forEach(part => {
    if (!rigData.bones.some(b => b.id === part)) {
      errors.push(`Missing required bone/group: ${part.replace('bone-', '')}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};
