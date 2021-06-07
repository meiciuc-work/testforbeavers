import { ListIteratingSystem } from '@ash.ts/ash';
import { Bullet } from '../components';
import { EntityCreator } from '../EntityCreator';
import { GameConfig } from '../GameConfig';
import { MovementNode } from '../nodes';

export class MovementSystem extends ListIteratingSystem<MovementNode> {
    private readonly config: GameConfig;
    private readonly creator: EntityCreator;

    public constructor(creator: EntityCreator, config: GameConfig) {
        super(MovementNode);
        this.creator = creator;
        this.config = config;
    }

    public updateNode(node: MovementNode, time: number): void {
        
        const { position, motion } = node;
        const { screenWidth: width, screenHeight: height } = this.config;
        position.x += motion.velocityX * time;
        position.y += motion.velocityY * time;

        let out = false;
        if (node.moveBack.back) {
            const deltaBounds = node.moveBack.collisionRadius;
            if (position.x < -deltaBounds) {
                position.x += width + deltaBounds * 2;
                out = true;
            }
            if (position.x > width + deltaBounds) {
                position.x -= (width + deltaBounds * 2);
                out = true;
            }
            if (position.y < -deltaBounds) {
                position.y += height + deltaBounds * 2;
                out = true;
            }
            if (position.y > height + deltaBounds) {
                position.y -= (height + deltaBounds * 2);
                out = true;
            }
        }

        if (out && !node.moveBack.back) {
            this.creator.destroyEntity(node.entity);
            return;
        }

        position.rotation += motion.angularVelocity * time;
        if (motion.damping > 0) {
            const xDamp: number = Math.abs(Math.cos(position.rotation) * motion.damping * time);
            const yDamp: number = Math.abs(Math.sin(position.rotation) * motion.damping * time);
            if (motion.velocityX > xDamp) {
                motion.velocityX -= xDamp;
            } else if (motion.velocityX < -xDamp) {
                motion.velocityX += xDamp;
            } else {
                motion.velocityX = 0;
            }
            if (motion.velocityY > yDamp) {
                motion.velocityY -= yDamp;
            } else if (motion.velocityY < -yDamp) {
                motion.velocityY += yDamp;
            } else {
                motion.velocityY = 0;
            }
        }
    }
}
