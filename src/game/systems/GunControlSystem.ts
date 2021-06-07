import { Engine, NodeList, System } from '@ash.ts/ash';
import { EntityCreator } from '../EntityCreator';
import { KeyPoll } from '../KeyPoll';
import { GameNode, GunControlNode } from '../nodes';
import { Sounds } from '../sounds';
import { TouchPoll } from '../TouchPoll';

export class GunControlSystem extends System {
    
    private readonly keyPoll: KeyPoll;
    private readonly touchPoll: TouchPoll;
    private readonly creator: EntityCreator;

    private guns: NodeList<GunControlNode> | null = null;
    private game: NodeList<GameNode> | null = null;

    public constructor(keyPoll: KeyPoll, touchPoll: TouchPoll, creator: EntityCreator) {
        super();
        this.keyPoll = keyPoll;
        this.touchPoll = touchPoll;
        this.creator = creator;
    }

    addToEngine(engine: Engine): void {
        this.guns = engine.getNodeList(GunControlNode);
        this.game = engine.getNodeList(GameNode);
    }

    removeFromEngine(engine: Engine): void {
        this.guns = null;
        this.game = null;
    }

    update(time: number): void {
        for (let node: GunControlNode | undefined | null = this.guns?.head; node; node = node?.next) {
            const { control } = node;
            const { position } = node;
            const { gun } = node;

            gun.shooting = this.keyPoll.isDown(control.trigger) || this.touchPoll.click;
            gun.timeSinceLastShot += time;
            if (gun.shooting && gun.timeSinceLastShot >= gun.minimumShotInterval) {
                if (this.game && this.game.head) {
                    this.game.head.state.shots++
                }
                this.creator.createUserBullet(gun, position);
                node.audio.play(Sounds.shoot);
                gun.timeSinceLastShot = 0;
            }
        }
    }
}
