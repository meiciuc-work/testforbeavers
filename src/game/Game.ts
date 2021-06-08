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
    HudSystem,
    MotionControlSystem,
    MovementSystem,
    RenderSystem,
    SystemPriorities,
} from './systems';
import { loadAudioDB } from './sounds';
import { TouchPoll } from './TouchPoll';
import EnvironmentEmitterSystem from './systems/EnvironmentEmitterSystem';
import AssetsLoader from './AssetsLoader';

async function skip(tickProvider: FrameTickProvider, count = 1) {
    let resolve: Function | null = null;

    const foo = (time: number) => {
        count--;
        if (!count) {
            tickProvider.remove(foo);
            resolve!(true);
        }
    }

    return new Promise(res => {
        resolve = res;
        tickProvider.add(foo);
    });
}

export async function game(container: HTMLElement): Promise<void> {

    const assets: AssetsLoader = new AssetsLoader();
    await assets.execute();

    const config = new GameConfig(container.clientWidth, container.clientHeight);
    const engine = new Engine();
    const creator = new EntityCreator(engine, config, assets);
    const keyPoll = new KeyPoll();
    const touchPoll = new TouchPoll();
    const tickProvider = new FrameTickProvider();

    const audioContext = new AudioContext();
    const audioDB = await loadAudioDB(audioContext);

    tickProvider.add((delta: number) => engine.update(delta));
    tickProvider.start();

    engine.addSystem(new RenderSystem(container, { emitStageEvents: true }, creator, config), SystemPriorities.render);

    await skip(tickProvider, 100);
    
    engine.addSystem(new GameManager(creator, config), SystemPriorities.preUpdate);
    engine.addSystem(new MotionControlSystem(keyPoll, touchPoll), SystemPriorities.update);
    engine.addSystem(new DeathThroesSystem(creator), SystemPriorities.update);
    engine.addSystem(new MovementSystem(creator, config), SystemPriorities.move);
    engine.addSystem(new CollisionSystem(creator), SystemPriorities.resolveCollisions);
    engine.addSystem(new AnimationSystem(), SystemPriorities.animate);
    engine.addSystem(new HudSystem(), SystemPriorities.preUpdate);
    engine.addSystem(new EnvironmentEmitterSystem(creator, config), SystemPriorities.preUpdate);

    //   engine.addSystem(new AudioSystem(audioContext, audioDB), SystemPriorities.audio);

    creator.createGame();
}