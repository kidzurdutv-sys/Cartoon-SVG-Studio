import { create } from 'zustand';
import { type CharacterRigData, type PropRigData, type Keyframe } from '../types';

interface StudioState {
  canvasSVG: string | null;
  environmentSVG: string | null;
  props: PropRigData[];
  selectedElementId: string | null;
  activeTab: 'generate' | 'rig' | 'animate' | 'export';
  rigData: CharacterRigData | null;
  animationKeyframes: Keyframe[];
  isGenerating: boolean;
  generationError: string | null;
  history: string[];
  historyIndex: number;
}

interface StudioActions {
  setCanvasSVG: (svg: string | null) => void;
  setEnvironmentSVG: (svg: string | null) => void;
  addProp: (prop: PropRigData) => void;
  updateProp: (id: string, updates: Partial<PropRigData>) => void;
  removeProp: (id: string) => void;
  selectElement: (id: string | null) => void;
  setActiveTab: (tab: StudioState['activeTab']) => void;
  setRigData: (data: CharacterRigData | null) => void;
  addKeyframe: (keyframe: Keyframe) => void;
  updateKeyframe: (id: string, updates: Partial<Keyframe>) => void;
  deleteKeyframe: (id: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  undo: () => void;
  redo: () => void;
  resetCanvas: () => void;
  saveToHistory: () => void;
}

type StudioStore = StudioState & StudioActions;

const MAX_HISTORY = 20;

export const useStudioStore = create<StudioStore>((set, get) => ({
  canvasSVG: null,
  environmentSVG: null,
  props: [],
  selectedElementId: null,
  activeTab: 'generate',
  rigData: null,
  animationKeyframes: [],
  isGenerating: false,
  generationError: null,
  history: [],
  historyIndex: -1,

  saveToHistory: () => {
    const state = get();
    // Serialize current state we care about for history
    const currentStateStr = JSON.stringify({
      canvasSVG: state.canvasSVG,
      environmentSVG: state.environmentSVG,
      props: state.props,
      rigData: state.rigData,
      animationKeyframes: state.animationKeyframes,
    });

    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(currentStateStr);
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setCanvasSVG: (svg) => {
    set({ canvasSVG: svg });
    get().saveToHistory();
  },

  setEnvironmentSVG: (svg) => {
    set({ environmentSVG: svg });
    get().saveToHistory();
  },

  addProp: (prop) => {
    set((state) => ({ props: [...state.props, prop] }));
    get().saveToHistory();
  },

  updateProp: (id, updates) => {
    set((state) => ({
      props: state.props.map((p) => (p.propId === id ? { ...p, ...updates } : p)),
    }));
    get().saveToHistory();
  },

  removeProp: (id) => {
    set((state) => ({
      props: state.props.filter((p) => p.propId !== id),
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    }));
    get().saveToHistory();
  },

  selectElement: (id) => set({ selectedElementId: id }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setRigData: (data) => {
    set({ rigData: data });
    get().saveToHistory();
  },

  addKeyframe: (keyframe) => {
    set((state) => ({ animationKeyframes: [...state.animationKeyframes, keyframe] }));
    get().saveToHistory();
  },

  updateKeyframe: (id, updates) => {
    set((state) => ({
      animationKeyframes: state.animationKeyframes.map((kf) =>
        kf.id === id ? { ...kf, ...updates } : kf
      ),
    }));
    get().saveToHistory();
  },

  deleteKeyframe: (id) => {
    set((state) => ({
      animationKeyframes: state.animationKeyframes.filter((kf) => kf.id !== id),
    }));
    get().saveToHistory();
  },

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setGenerationError: (error) => set({ generationError: error }),

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = JSON.parse(history[newIndex]);
      set({
        ...previousState,
        historyIndex: newIndex,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = JSON.parse(history[newIndex]);
      set({
        ...nextState,
        historyIndex: newIndex,
      });
    }
  },

  resetCanvas: () => {
    set({
      canvasSVG: null,
      environmentSVG: null,
      props: [],
      selectedElementId: null,
      rigData: null,
      animationKeyframes: [],
    });
    get().saveToHistory();
  },
}));
