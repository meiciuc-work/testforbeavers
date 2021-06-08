import { ListIteratingSystem } from '@ash.ts/ash';
import { EntityCreator } from '../EntityCreator';
import { GameConfig } from '../GameConfig';
import { MovementNode } from '../nodes';

export class MovementSystem extends ListIteratingSystem<MovementNode> {
    private readonly config: GameConfig;
    private readonly creator: EntityCreator;
    private readonly gravity = 50;

    public constructor(creator: EntityCreator, config: GameConfig) {
        super(MovementNode);
        this.creator = creator;
        this.config = config;
    }

    public updateNode(node: MovementNode, time: number): void {
        const { position, motion } = node;
        
        position.x += motion.velocityX * time;
        position.y += motion.velocityY * time;

        if (position.y < 0) {
            motion.velocityY += this.gravity;
        } else {
            motion.velocityY = 0;
        }
    }
}
