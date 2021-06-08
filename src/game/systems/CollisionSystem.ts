import { Engine, NodeList, System } from '@ash.ts/ash';
import Bunny from '../components/Bunny';
import { EntityCreator } from '../EntityCreator';
import { BunnyCollisionNode, BarrierCollisionNode } from '../nodes';

export class CollisionSystem extends System {
    private creator: EntityCreator;

    private bunny: NodeList<BunnyCollisionNode> | null = null;
    private barriers: NodeList<BarrierCollisionNode> | null = null;

    public constructor(creator: EntityCreator) {
        super();
        this.creator = creator;
    }

    public addToEngine(engine: Engine): void {
        this.bunny = engine.getNodeList(BunnyCollisionNode);
        this.barriers = engine.getNodeList(BarrierCollisionNode);
    }

    public update(time: number): void {
        if (!this.bunny || !this.bunny.head) {
            return;
        }

        if (this.bunny.head.position.y > 0) {
            // landing
            this.bunny.head.position.y = 0;
            this.bunny.head.bunny.fsm.changeState(Bunny.RIDING);
        }

        for (let barrier: BarrierCollisionNode | null | undefined = this.barriers?.head; barrier; barrier = barrier.next) {
            const distance = Math.hypot(
                barrier.position.x - this.bunny.head.position.x,
                barrier.position.y - this.bunny.head.position.y,
            );
            if (distance <= barrier.collision.radius + this.bunny.head.collision.radius) {
                this.creator.cameraShake();
                break;
            }
        }
    }

    public removeFromEngine(engine: Engine): void {
        this.bunny = null;
        this.barriers = null;
    }
}
