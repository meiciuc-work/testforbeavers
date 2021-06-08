import { Engine, Entity, EntityStateMachine, NodeList } from '@ash.ts/ash';
import { Container, filters, Sprite } from 'pixi.js';
import AssetsLoader from './AssetsLoader';
import {
    Animation,
    CameraShake,
    Collision,
    DeathThroes,
    Display,
    GameState,
    Motion,
    MotionControls,
    Position
} from './components';
import { Barrier } from './components/Barrier';
import Bunny from './components/Bunny';
import { GUI } from './components/GUI';
import Slope from './components/Slope';
import { GameConfig } from './GameConfig';
import { SlopeView } from './graphics/SlopeView';
import * as Keyboard from './Keyboard';
import { GameNode, GUINode } from './nodes';

export const entitiesNames = {
    GAME: 'game',
    CAMERA: 'camera',
}

export class EntityCreator {
    private engine: Engine;
    private config: GameConfig;
    private assets: AssetsLoader;
    private cameraPosition: Position = new Position(0, 0);

    public constructor(engine: Engine, config: GameConfig, assets: AssetsLoader) {
        this.engine = engine;
        this.config = config;
        this.assets = assets;
    }

    public getAssets(): AssetsLoader {
        return this.assets;
    }

    public createBarrier(x: number): Entity {
        const sprite: Sprite = new Sprite(this.assets.getTexture('stopper_idle')!);
        sprite.anchor.set(.5);

        const entity: Entity = new Entity()
            .add(new Barrier())
            .add(new Display(sprite))
            .add(new Position(x, -sprite.height / 2))
            .add(new Collision(sprite.width / 2));

        this.engine.addEntity(entity);
        return entity;
    }

    public createBunny(): Entity {
        const entity: Entity = new Entity();
        const fsm: EntityStateMachine = new EntityStateMachine(entity);

        const motion: Motion = new Motion(2000, 0, 0, 0);
        
        const riding: Sprite = new Sprite(this.getAssets().getTexture('bunny_riding')!);
        riding.anchor.set(.5, 1);
        riding.scale.set(.1);

        const flying: Sprite = new Sprite(this.getAssets().getTexture('bunny_flying')!);
        flying.anchor.set(.5, 1);
        flying.scale.set(.1);

        fsm.createState(Bunny.IDLE)
            .add(Motion)
            .withInstance(motion)
            .add(Display)
            .withInstance(new Display(flying))
            .add(Collision)
            .withInstance(new Collision(flying.width))

        fsm.createState(Bunny.RIDING)
            .add(Motion)
            .withInstance(motion)
            .add(MotionControls)
            .withInstance(new MotionControls(0, 0, Keyboard.UP, 0))
            .add(Display)
            .withInstance(new Display(riding))
            .add(Collision)
            .withInstance(new Collision(riding.width));

        fsm.createState(Bunny.FLYING)
            .add(Motion)
            .withInstance(motion)
            .add(Display)
            .withInstance(new Display(flying))
            .add(Collision)
            .withInstance(new Collision(flying.width))

        entity
            .add(new Bunny(fsm))
            .add(this.cameraPosition);

        fsm.changeState(Bunny.IDLE);
        this.engine.addEntity(entity);
        return entity;
    }

    public createSlope(): Entity {
        const slopeView: SlopeView = new SlopeView(this.getAssets().getTexture('floor')!);
        const entity: Entity = new Entity()
            .add(new Slope(slopeView))
            .add(new Display(slopeView))
            .add(new Position(GameConfig.screenWidth / 2, -10))
            .add(new Animation(slopeView));
        this.engine.addEntity(entity);
        return entity;
    }

    public destroyEntity(entity: Entity): void {
        this.engine.removeEntity(entity);
    }

    public showPopup(container: Container, x = 100, y = 100): Entity {
        this.removePopup();
        const entity: Entity = new Entity()
            .add(new GUI(container))
            .add(new Position(x, y, 0));
        this.engine.addEntity(entity);
        return entity;
    }

    public removePopup(): void {
        const list: NodeList<GUINode> = this.engine.getNodeList(GUINode);
        while (list && list.head) {
            this.destroyEntity(list.head.entity);
        }
    }

    public changeGameState(state: string): void {
        const list: NodeList<GameNode> = this.engine.getNodeList(GameNode);
        if (list && list.head) {
            list.head.state.state = state;
        }
    }

    public registerCameraContainer(container: Container): Entity {
        const entity: Entity = new Entity(entitiesNames.CAMERA)
            .add(new Display(container));
        this.engine.addEntity(entity);
        return entity;
    }

    public createGame(): Entity {
        const gameEntity: Entity = new Entity(entitiesNames.GAME)
            .add(new GameState())
        this.engine.addEntity(gameEntity);
        return gameEntity;
    }

    public cameraShake(magnitude = 16, time = 1): Entity | null {
        const camera: Entity | null  = this.engine.getEntityByName(entitiesNames.CAMERA);
        if (!camera) {
            return null;
        }

        const entity: Entity = new Entity()
            .add(new DeathThroes(1))
            .add(new Animation(new CameraShake((camera.get(Display) as Display).displayObject, magnitude, time)));
        this.engine.addEntity(entity);
        return entity;
    }

    public cameraBlur(value: boolean): void {
        const camera: Entity | null  = this.engine.getEntityByName(entitiesNames.CAMERA);
        if (!camera) {
            return;
        }

        if (value) {
            (camera.get(Display) as Display).displayObject.filters = [new filters.BlurFilter()];
        } else {
            (camera.get(Display) as Display).displayObject.filters = [];
        }
    }
}
