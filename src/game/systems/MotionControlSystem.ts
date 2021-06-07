import { ListIteratingSystem } from '@ash.ts/ash';
import { KeyPoll } from '../KeyPoll';
import { MotionControlNode } from '../nodes';
import { TouchPoll } from '../TouchPoll';

export class MotionControlSystem extends ListIteratingSystem<MotionControlNode> {
    private keyPoll: KeyPoll;
    private touchPoll: TouchPoll;

    public constructor(keyPoll: KeyPoll, touchPoll: TouchPoll) {
        super(MotionControlNode);
        this.keyPoll = keyPoll;
        this.touchPoll = touchPoll;
    }

    public updateNode(node: MotionControlNode, time: number): void {
        const { control } = node;
        const { position } = node;
        const { motion } = node;

        if (this.keyPoll.isDown(control.left) || this.touchPoll.left) {
            position.rotation -= control.rotationRate * time;
            motion.velocityX += Math.cos(position.rotation) * control.accelerationRate / 2 * time;
            motion.velocityY += Math.sin(position.rotation) * control.accelerationRate / 2 * time;
        }

        if (this.keyPoll.isDown(control.right) || this.touchPoll.right) {
            position.rotation += control.rotationRate * time;
            motion.velocityX += Math.cos(position.rotation) * control.accelerationRate / 2 * time;
            motion.velocityY += Math.sin(position.rotation) * control.accelerationRate / 2 * time;
        }

        if (this.keyPoll.isDown(control.accelerate) || this.touchPoll.top) {
            motion.velocityX += Math.cos(position.rotation) * control.accelerationRate * time;
            motion.velocityY += Math.sin(position.rotation) * control.accelerationRate * time;
        }
    }
}
