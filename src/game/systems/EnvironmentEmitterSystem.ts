import { Engine, NodeList, System } from "@ash.ts/ash";
import { EntityCreator } from "../EntityCreator";
import { GameConfig } from "../GameConfig";
import { BarrierCollisionNode, BunnyNode, GameNode, SlopeNode } from "../nodes";
import { GameState } from "../components";

export default class EnvironmentEmitterSystem extends System {
    private barriers: NodeList<BarrierCollisionNode> | null = null;
    private bunny: NodeList<BunnyNode> | null = null;
    private slope: NodeList<SlopeNode> | null = null;
    private game: NodeList<GameNode> | null = null;
    
    private readonly creator: EntityCreator;
    private readonly config: GameConfig;

    private timeout = 0;
    private addBarrier = false;

    constructor(creator: EntityCreator, config: GameConfig) {
        super();
        this.creator = creator;
        this.config = config;
    }

    addToEngine(engine: Engine): void {
        this.barriers = engine.getNodeList(BarrierCollisionNode);
        this.bunny = engine.getNodeList(BunnyNode);
        this.slope = engine.getNodeList(SlopeNode);
        this.game = engine.getNodeList(GameNode);

        if (!this.slope.head) {
            this.creator.createSlope();
        }
    }

    removeFromEngine(engine: Engine): void {
        if (this.slope) {
            while (this.slope.head) {
                this.creator.destroyEntity(this.slope.head.entity);
            }
        }

        if (this.barriers) {
            while (this.barriers.head) {
                this.creator.destroyEntity(this.barriers.head.entity);
            }
        }
        
        this.barriers = null;
        this.bunny = null;
        this.slope = null;
        this.game = null;
    }

    update(time: number): void {
        if (this.slope && this.slope.head && this.bunny && this.bunny.head) {
            this.slope.head.slope.velocityX = -this.bunny.head.motion.velocityX;
            this.slope.head.position.x = this.bunny.head.position.x;
        }

        if (this.game && this.game.head && this.game.head.state.state == GameState.PLAY && this.bunny && this.bunny.head) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => {
                    this.addBarrier = true;
                    this.timeout = 0;
                }, Math.floor(((Math.random() * 2) + 1) * 1000));
            }

            if (this.addBarrier) {
                this.creator.createBarrier(this.bunny.head.position.x + GameConfig.screenWidth);
                this.addBarrier = false;

                for (let node: BarrierCollisionNode | null | undefined = this.barriers?.head; node; node = node.next) {
                    if (node.position.x < this.bunny.head.position.x - this.config.screenWidth) {
                        this.creator.destroyEntity(node.entity);
                    }
                }
            }
        }
    }
}