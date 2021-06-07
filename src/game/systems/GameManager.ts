import { Engine, NodeList, System } from '@ash.ts/ash';
import { GameState } from '../components';
import { EntityCreator } from '../EntityCreator';
import { GameConfig } from '../GameConfig';
import { AsteroidCollisionNode, BulletCollisionNode, GameNode, SpaceshipNode } from '../nodes';

export class GameManager extends System {
    private config: GameConfig;
    private creator: EntityCreator;

    private games: NodeList<GameNode> | null = null;
    private spaceships: NodeList<SpaceshipNode> | null = null;
    private asteroids: NodeList<AsteroidCollisionNode> | null = null;
    private bullets: NodeList<BulletCollisionNode> | null = null;

    private currentGameState = '';

    public constructor(creator: EntityCreator, config: GameConfig) {
        super();
        this.creator = creator;
        this.config = config;
    }

    public addToEngine(engine: Engine): void {
        this.games = engine.getNodeList(GameNode);
        this.spaceships = engine.getNodeList(SpaceshipNode);
        this.asteroids = engine.getNodeList(AsteroidCollisionNode);
        this.bullets = engine.getNodeList(BulletCollisionNode);

        this.creator.createBackground();
    }

    public removeFromEngine(engine: Engine): void {
        this.games = null;
        this.spaceships = null;
        this.asteroids = null;
        this.bullets = null;
    }

    public update(time: number): void {
        const gameNode = this.games!.head;
        if (!gameNode) {
            return;
        }

        if (gameNode.state.state != GameState.PLAY) {
            this.currentGameState = gameNode.state.state;
            return;
        }

        if (this.currentGameState == GameState.WAIT_FOR_START || this.currentGameState == GameState.FINISH) {
            // start
            while (this.asteroids?.head) {
                this.creator.destroyEntity(this.asteroids.head.entity);
            }
        }

        this.currentGameState = gameNode.state.state;

        if (this.spaceships!.empty) {
            if (gameNode.state.lives) {
                // next live
                const positionX = this.config.screenWidth / 2;
                const positionY = this.config.screenHeight / 2;
                const deltaRadius = Math.floor(GameConfig.DEFAULT_ASTEROID_MAX_SIZE * 1.7);
                let clearToAddSpaceship = true;
                for (let asteroid = this.asteroids!.head; asteroid; asteroid = asteroid.next) {
                    const distance = Math.hypot(asteroid.position.x - positionX, asteroid.position.y - positionY);
                    if (distance <= asteroid.collision.radius + deltaRadius) {
                        clearToAddSpaceship = false;
                        break;
                    }
                }
                if (clearToAddSpaceship) {
                    this.creator.createSpaceship();
                }
            } else {
                // finish
                gameNode.state.setForFinish();
            }
        }

        if (this.asteroids!.empty && this.bullets!.empty && this.spaceships!.head) {
            // next level
            const spaceship: SpaceshipNode | null = this.spaceships!.head;
            gameNode.state.level += 1;
            const asteroidCount: number = GameConfig.DEFAULT_ASTEROIDS_MIN_COUNT + gameNode.state.level;
            // const minDistance = Math.floor(GameConfig.DEFAULT_ASTEROID_MAX_SIZE * 2.7);
            // for (let i = 0; i < asteroidCount; i += 1) {
            //     let positionX: number;
            //     let positionY: number;
            //     // check not on top of spaceship
            //     do {
            //         positionX = Math.random() * this.config.width;
            //         positionY = Math.random() * this.config.height;
            //     }
            //     while (Math.hypot(positionX - spaceship.position.x, positionY - spaceship.position.y) <= minDistance);
            //     this.creator.createAsteroid(GameConfig.DEFAULT_ASTEROID_MAX_SIZE, positionX, positionY);
            // }

            // прикольно, когда астреоиды возникают не "вдруг" - пусть влетают из-за края экрана
            let promise: Promise<boolean> = Promise.resolve(true);
            for (let i = 0; i < asteroidCount; i++) {
                promise = promise.then(() => {
                    const positionX = Math.random() > .5 ? Math.random() * this.config.screenWidth : -GameConfig.DEFAULT_ASTEROID_MAX_SIZE;
                    const positionY = positionX == -GameConfig.DEFAULT_ASTEROID_MAX_SIZE ? Math.random() * this.config.screenHeight : -GameConfig.DEFAULT_ASTEROID_MAX_SIZE;
                    this.creator.createAsteroid(GameConfig.DEFAULT_ASTEROID_MAX_SIZE, positionX, positionY);
                    console.log('createAsteroid')
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(true);
                        }, 1000);
                    })
                });
            }
        }
    }
}