import { Container, Graphics } from 'pixi.js';

export class BunnyView extends Container {
    public constructor(width: number, height: number) {
        super();
        
        const gr: Graphics = new Graphics();
        gr.beginFill(0x999999).drawEllipse(0, 0, width, height).endFill();
        gr.setTransform(-width / 2, -height / 2)
        
        this.addChild(gr);
    }
}
