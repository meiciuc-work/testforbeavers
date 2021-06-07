import { Engine, Entity, EntityStateMachine } from '@ash.ts/ash';
import { Container, DisplayObject } from '@pixi/display';
import {
    Animation,
    Asteroid,
    Audio,
    Bullet,
    CameraShake,
    Collision,
    DeathThroes,
    Display,
    GameState,
    Gun,
    GunControls,
    Motion,
    MotionControls,
    MoveBackFromScreenEdge,
    Position,
    Spaceship,
} from './components';
import { GameConfig } from './GameConfig';
import {
    AsteroidDeathView,
    AsteroidView,
    BulletView,
    DebugCrossView,
    SpaceshipDeathView,
    SpaceshipView,
} from './graphics';
import { BackgroundView } from './graphics/BackgroundView';
import * as Keyboard from './Keyboard';

export const entitiesNames = {
    GAME: 'game',
    CAMERA: 'camera',
}

export class EntityCreator {
    private waitEntity!: Entity;

    private engine: Engine;

    private config: GameConfig;

    public constructor(engine: Engine, config: GameConfig) {
        this.engine = engine;
        this.config = config;
    }

    public destroyEntity(entity: Entity): void {
        this.engine.removeEntity(entity);
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

    public createAsteroid(radius: number, x: number, y: number): Entity {
        const asteroid: Entity = new Entity();

        const fsm: EntityStateMachine = new EntityStateMachine(asteroid);

        const velocityX = 10 + (Math.random() - 0.5) * (GameConfig.DEFAULT_ASTEROID_MAX_SIZE / 10) * (GameConfig.DEFAULT_ASTEROID_MAX_SIZE * 2 - radius);
        const velocityY = 10 + (Math.random() - 0.5) * (GameConfig.DEFAULT_ASTEROID_MAX_SIZE / 10) * (GameConfig.DEFAULT_ASTEROID_MAX_SIZE * 2 - radius);
        const angularVelocity: number = Math.random() * 2 - 1;

        fsm.createState('alive')
            .add(Motion)
            .withInstance(new Motion(velocityX, velocityY, angularVelocity))
            .add(Collision)
            .withInstance(new Collision(radius))
            .add(Display)
            .withInstance(new Display(new AsteroidView(radius)))
            .add(MoveBackFromScreenEdge)
            .withInstance(new MoveBackFromScreenEdge(radius));

        const deathView: AsteroidDeathView = new AsteroidDeathView(radius);
        fsm.createState('destroyed')
            .add(Motion)
            .withInstance(new Motion(velocityX, velocityY, 0))
            .add(DeathThroes)
            .withInstance(new DeathThroes(3))
            .add(Display)
            .withInstance(new Display(deathView))
            .add(Animation)
            .withInstance(new Animation(deathView))
            .add(MoveBackFromScreenEdge)
            .withInstance(new MoveBackFromScreenEdge());

        asteroid
            .add(new Asteroid(fsm))
            .add(new Position(x, y, 0))
            .add(new Audio());

        fsm.changeState('alive');
        this.engine.addEntity(asteroid);
        return asteroid;
    }

    public createSpaceship(): Entity {
        const spaceship: Entity = new Entity();
        const fsm: EntityStateMachine = new EntityStateMachine(spaceship);

        const motion: Motion = new Motion(0, 0, 0, 15);

        fsm.createState('playing')
            .add(Motion)
            .withInstance(motion)
            .add(MotionControls)
            .withInstance(new MotionControls(Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, 100, 3))
            .add(Gun)
            .withInstance(new Gun(8, 0, 0.3, 2))
            .add(GunControls)
            .withInstance(new GunControls(Keyboard.SPACE))
            .add(Collision)
            .withInstance(new Collision(9))
            .add(Display)
            .withInstance(new Display(new SpaceshipView()))
            .add(MoveBackFromScreenEdge)
            .withInstance(new MoveBackFromScreenEdge(9));

        const deathView: SpaceshipDeathView = new SpaceshipDeathView();
        fsm.createState('destroyed')
            .add(Motion)
            .withInstance(motion)
            .add(DeathThroes)
            .withInstance(new DeathThroes(5))
            .add(Display)
            .withInstance(new Display(deathView))
            .add(Animation)
            .withInstance(new Animation(deathView))
            .add(MoveBackFromScreenEdge)
            .withInstance(new MoveBackFromScreenEdge());

        spaceship
            .add(new Spaceship(fsm))
            .add(new Position(this.config.screenWidth / 2, this.config.screenHeight / 2, 0))
            .add(new Audio());

        fsm.changeState('playing');
        this.engine.addEntity(spaceship);
        return spaceship;
    }

    public createUserBullet(gun: Gun, parentPosition: Position): Entity {
        const cos: number = Math.cos(parentPosition.rotation);
        const sin: number = Math.sin(parentPosition.rotation);
        const bullet: Entity = new Entity()
            .add(new Bullet())
            .add(new DeathThroes(gun.bulletLifetime))
            .add(new Position(
                cos * gun.offsetFromParentX - sin * gun.offsetFromParentY + parentPosition.x,
                sin * gun.offsetFromParentX + cos * gun.offsetFromParentY + parentPosition.y,
                0,
            ))
            .add(new Collision(0))
            .add(new Motion(cos * 150, sin * 150, 0, 0))
            .add(new Display(new BulletView()))
            .add(new MoveBackFromScreenEdge());
        this.engine.addEntity(bullet);
        return bullet;
    }

    public createBackground(): Entity {
        const padding = GameConfig.DEFAULT_CAMERA_SHAKE_MAGNITUDE_FOR_SPACESHIP * 4;
        const size = Math.max(this.config.screenWidth + padding, this.config.screenHeight + padding);
        
        const entity: Entity = new Entity()
            .add(new Display(new BackgroundView(size, size)))
            .add(new Position(this.config.screenWidth / 2, this.config.screenWidth / 2));
        this.engine.addEntity(entity);
        return entity;
    }

    public createDebugCrossView(size: number, x: number, y: number): Entity {
        const entity: Entity = new Entity()
            .add(new Display(new DebugCrossView(size, `${x}:${y}`)))
            .add(new Position(x, y));
        this.engine.addEntity(entity);
        return entity;
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
}
