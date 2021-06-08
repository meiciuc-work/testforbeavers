import { defineNode } from '@ash.ts/ash';
import {
  Animation,
  Audio,
  Collision,
  DeathThroes,
  Display,
  GameState,
  Motion,
  MotionControls,
  Position,
  CameraShake,
} from './components';
import { Barrier } from './components/Barrier';
import Bunny from './components/Bunny';
import { GUI } from './components/GUI';
import Slope from './components/Slope';

export const AnimationNode = defineNode({
  animation: Animation,
}, 'AnimationNode');
export type AnimationNode = InstanceType<typeof AnimationNode>;

export const AudioNode = defineNode({
  audio: Audio,
}, 'AudioNode');
export type AudioNode = InstanceType<typeof AudioNode>;

export const DeathThroesNode = defineNode({
  death: DeathThroes,
}, 'DeathThroesNode');
export type DeathThroesNode = InstanceType<typeof DeathThroesNode>;

export const GameNode = defineNode({
  state: GameState,
}, 'GameNode');
export type GameNode = InstanceType<typeof GameNode>;

export const MotionControlNode = defineNode({
  control: MotionControls,
  position: Position,
  motion: Motion,
}, 'MotionControlNode');
export type MotionControlNode = InstanceType<typeof MotionControlNode>;

export const MovementNode = defineNode({
  position: Position,
  motion: Motion,
}, 'MovementNode');
export type MovementNode = InstanceType<typeof MovementNode>;

export const RenderNode = defineNode({
  position: Position,
  display: Display,
}, 'RenderNode');
export type RenderNode = InstanceType<typeof RenderNode>;

export const GUINode = defineNode({
    position: Position,
    display: GUI,
  }, 'RenderNode');
  export type GUINode = InstanceType<typeof GUINode>;

export const BunnyControlNode = defineNode({
    bunny: Bunny,
    position: Position,
    collision: Collision,
    control: MotionControls,
    motion: Motion,
  //   audio: Audio,
}, 'BunnyControlNode');
export type BunnyControlNode = InstanceType<typeof BunnyControlNode>;

export const BunnyCollisionNode = defineNode({
  bunny: Bunny,
  position: Position,
  collision: Collision,
//   audio: Audio,
}, 'BunnyCollisionNode');
export type BunnyCollisionNode = InstanceType<typeof BunnyCollisionNode>;

export const CameraShakeNode = defineNode({
    shake: CameraShake,
  }, 'CameraShakeNode');
export type CameraShakeNode = InstanceType<typeof CameraShakeNode>;

export const BunnyNode = defineNode({
    bunny: Bunny,
    position: Position,
    motion: Motion,
}, 'BunnyNode');
export type BunnyNode = InstanceType<typeof BunnyNode>;

export const SlopeNode = defineNode({
    slope: Slope,
    position: Position,
}, 'SlopeNode');
export type SlopeNode = InstanceType<typeof SlopeNode>;

export const BarrierCollisionNode = defineNode({
    barrier: Barrier,
    position: Position,
    collision: Collision,
  //   audio: Audio,
  }, 'BarrierCollisionNode');
export type BarrierCollisionNode = InstanceType<typeof BarrierCollisionNode>;