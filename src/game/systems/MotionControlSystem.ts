import { ListIteratingSystem } from '@ash.ts/ash';
import Bunny from '../components/Bunny';
import { KeyPoll } from '../KeyPoll';
import { BunnyControlNode } from '../nodes';
import { TouchPoll } from '../TouchPoll';

export class MotionControlSystem extends ListIteratingSystem<BunnyControlNode> {
    private keyPoll: KeyPoll;
    private touchPoll: TouchPoll;

    public constructor(keyPoll: KeyPoll, touchPoll: TouchPoll) {
        super(BunnyControlNode);
        this.keyPoll = keyPoll;
        this.touchPoll = touchPoll;
    }

    public updateNode(node: BunnyControlNode, time: number): void {
        const { control } = node;
        const { motion } = node;

        if (this.keyPoll.isDown(control.top) || this.touchPoll.click) {
            motion.velocityY = -1300;
            node.bunny.fsm.changeState(Bunny.FLYING);
        }
    }
}
