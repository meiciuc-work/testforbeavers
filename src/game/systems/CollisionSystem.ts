import { Engine, NodeList, System } from '@ash.ts/ash';
import { EntityCreator } from '../EntityCreator';
import { GameConfig } from '../GameConfig';
import { AsteroidCollisionNode, BulletCollisionNode, GameNode, SpaceshipCollisionNode } from '../nodes';
import { Sounds } from '../sounds';

export class CollisionSystem extends System {
    private creator: EntityCreator;

    private games: NodeList<GameNode> | null = null;
    private spaceships: NodeList<SpaceshipCollisionNode> | null = null;
    private asteroids: NodeList<AsteroidCollisionNode> | null = null;
    private bullets: NodeList<BulletCollisionNode> | null = null;

    public constructor(creator: EntityCreator) {
        super();
        this.creator = creator;
    }

    public addToEngine(engine: Engine): void {
        this.games = engine.getNodeList(GameNode);
        this.spaceships = engine.getNodeList(SpaceshipCollisionNode);
        this.asteroids = engine.getNodeList(AsteroidCollisionNode);
        this.bullets = engine.getNodeList(BulletCollisionNode);
    }

    public update(time: number): void {
        const maxSize = GameConfig.DEFAULT_ASTEROID_MAX_SIZE;
        const minSize = Math.floor(maxSize * (1 / 3));
        const oneSix = Math.floor(maxSize / 6);

        for (let bullet = this.bullets!.head; bullet; bullet = bullet.next) {
            for (let asteroid = this.asteroids!.head; asteroid; asteroid = asteroid.next) {
                const distance = Math.hypot(asteroid.position.x - bullet.position.x, asteroid.position.y - bullet.position.y);
                if (distance <= asteroid.collision.radius) {
                    this.creator.destroyEntity(bullet.entity);
                    if (asteroid.collision.radius > minSize) {
                        const radius = asteroid.collision.radius - minSize;
                        let x = asteroid.position.x + Math.random() * 10 - oneSix;
                        let y = asteroid.position.y + Math.random() * 10 - oneSix;
                        this.creator.createAsteroid(radius, x, y);
                        x = asteroid.position.x + Math.random() * 10 - oneSix;
                        y = asteroid.position.y + Math.random() * 10 - oneSix;
                        this.creator.createAsteroid(radius, x, y);
                    }
                    asteroid.asteroid.fsm.changeState('destroyed');
                    asteroid.audio.play(Sounds.asteroid);
                    if (this.games!.head) {
                        this.games!.head.state.hits += 1;
                    }

                    const scale = asteroid.collision.radius / GameConfig.DEFAULT_ASTEROID_MAX_SIZE;
                    const magnitude = GameConfig.DEFAULT_CAMERA_SHAKE_MAGNITUDE_FOR_ASTEROID * scale;
                    this.creator.cameraShake(Math.floor(magnitude), GameConfig.DEFAULT_CAMERA_SHAKE_TIME_FOR_ASTEROID * scale);
                    break;
                }
            }
        }

        for (let spaceship = this.spaceships!.head; spaceship; spaceship = spaceship.next) {
            for (let asteroid = this.asteroids!.head; asteroid; asteroid = asteroid.next) {
                const distance = Math.hypot(
                    asteroid.position.x - spaceship.position.x,
                    asteroid.position.y - spaceship.position.y,
                );
                if (distance <= asteroid.collision.radius + spaceship.collision.radius) {
                    spaceship.spaceship.fsm.changeState('destroyed');
                    spaceship.audio.play(Sounds.ship);
                    if (this.games!.head) {
                        this.games!.head.state.lives -= 1;
                    }
                    this.creator.cameraShake(GameConfig.DEFAULT_CAMERA_SHAKE_MAGNITUDE_FOR_SPACESHIP, GameConfig.DEFAULT_CAMERA_SHAKE_TIME_FOR_SPACESHIP);
                    break;
                }
            }
        }
    }

    public removeFromEngine(engine: Engine): void {
        this.games = null;
        this.spaceships = null;
        this.asteroids = null;
        this.bullets = null;
    }
}
