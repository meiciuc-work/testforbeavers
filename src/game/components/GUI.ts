import { DisplayObject } from 'pixi.js';

export class GUI {
    public displayObject: DisplayObject;

    public constructor(displayObject: DisplayObject) {
        this.displayObject = displayObject;
    }
}
