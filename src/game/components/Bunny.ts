import { EntityStateMachine } from '@ash.ts/ash';

export default class Bunny {
    public static IDLE = 'idle';
    public static RIDING = 'riding';
    public static FLYING = 'flying';
    public static FELT = 'felt';

    public fsm: EntityStateMachine;

    public constructor(fsm: EntityStateMachine) {
        this.fsm = fsm;
    }
}
