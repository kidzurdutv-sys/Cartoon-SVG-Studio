export interface Bone {
  id: string;
  parentId: string | null;
  name: string;
  restAngle: number;
  length: number;
  origin: { x: number; y: number };
}

export interface Joint {
  id: string;
  boneId: string;
  position: { x: number; y: number };
  type: 'rotate' | 'translate' | 'scale';
  limits: { min: number; max: number };
}

export interface Constraint {
  id: string;
  type: 'ik' | 'ccik' | 'limit';
  targetBoneId: string;
  effectorPosition?: { x: number; y: number };
}

export interface CharacterRigData {
  bones: Bone[];
  joints: Joint[];
  constraints: Constraint[];
}

export interface PropRigData {
  propId: string;
  svg: string;
  transform: { x: number; y: number; rotation: number; scale: number };
  draggable: boolean;
  resizable: boolean;
}

export interface Keyframe {
  id: string;
  time: number;
  boneValues: Record<string, number>;
}

export interface ExportOptions {
  format: 'svg' | 'animated-svg' | 'png-sequence';
  fps?: number;
  resolution?: string;
}

export interface GenerationParams {
  prompt: string;
  styleId: string;
  complexity: 'simple' | 'medium' | 'detailed';
}

export interface ProjectData {
  name: string;
  characterSVG: string | null;
  environmentSVG: string | null;
  props: PropRigData[];
  rigData: CharacterRigData | null;
  keyframes: Keyframe[];
  createdAt: string;
  updatedAt: string;
}

export interface EnvLayer {
  id: string;
  name: string;
  svgContent: string;
  parallax: number;
  zOrder: number;
}

export interface EnvironmentRigData {
  layers: EnvLayer[];
  parallaxFactors: number[];
}

export interface StyleToken {
  id: string;
  name: string;
  description: string;
  colorPalette: string[];
  lineStyle: 'thick' | 'thin' | 'none';
  featureStyle: 'round' | 'sharp' | 'angular';
  promptModifier: string;
}
