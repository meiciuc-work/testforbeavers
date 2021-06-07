import { Engine, System } from "@ash.ts/ash";
import { EntityCreator } from "../EntityCreator";

export default class DebugSystem extends System {
    private readonly creator: EntityCreator;
    constructor (creator: EntityCreator) {
        super();
        this.creator = creator;
    }

    addToEngine(engine: Engine): void {
        // throw new Error("Method not implemented.");
        const size = 300;

        this.creator.createDebugCrossView(size, 300, 300);
    }
    removeFromEngine(engine: Engine): void {
        // throw new Error("Method not implemented.");
        console.log('DebugSystem removeFromEngine')
    }
    update(time: number): void {
        // throw new Error("Method not implemented.");
    }

}