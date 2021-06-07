import { Engine, FrameTickProvider } from '@ash.ts/ash';
import { EntityCreator } from './EntityCreator';
import { GameConfig } from './GameConfig';
import { KeyPoll } from './KeyPoll';
import {
  AnimationSystem,
  AudioSystem,
  CollisionSystem,
  DeathThroesSystem,
  GameManager,
  GunControlSystem,
  HudSystem,
  MotionControlSystem,
  MovementSystem,
  RenderSystem,
  SystemPriorities,
} from './systems';
import { loadAudioDB } from './sounds';
import { TouchPoll } from './TouchPoll';

export async function asteroids(container:HTMLElement):Promise<void> {
  const config = new GameConfig(container.clientWidth, container.clientHeight);
  const engine = new Engine();
  const creator = new EntityCreator(engine, config);
  const keyPoll = new KeyPoll();
  const touchPoll = new TouchPoll();
  const tickProvider = new FrameTickProvider();

  const audioContext = new AudioContext();
  const audioDB = await loadAudioDB(audioContext);

  tickProvider.add((delta:number) => engine.update(delta));
  tickProvider.start();

  engine.addSystem(new GameManager(creator, config), SystemPriorities.preUpdate);
  engine.addSystem(new MotionControlSystem(keyPoll, touchPoll), SystemPriorities.update);
  engine.addSystem(new GunControlSystem(keyPoll, touchPoll, creator), SystemPriorities.update);
  engine.addSystem(new DeathThroesSystem(creator), SystemPriorities.update);
  engine.addSystem(new MovementSystem(creator, config), SystemPriorities.move);
  engine.addSystem(new CollisionSystem(creator), SystemPriorities.resolveCollisions);
  engine.addSystem(new AnimationSystem(), SystemPriorities.animate);
  engine.addSystem(new HudSystem(), SystemPriorities.preUpdate);
  engine.addSystem(new RenderSystem(container, {emitStageEvents: true},  creator, config), SystemPriorities.render);
//   engine.addSystem(new AudioSystem(audioContext, audioDB), SystemPriorities.audio);

  creator.createGame();
}
