import { Graphics, Container, Text, TextStyle } from 'pixi.js';

export class DebugCrossView extends Container {

    public constructor(size: number, text = '', color = 0xffffff, alpha = .2) {
        super();
        const thickness = 2;

        const cross: Graphics = new Graphics();
        cross.beginFill(color, alpha)
            .drawRect(-size / 2, -thickness / 2, size, thickness)
            .endFill();
        cross.beginFill(color, alpha)
            .drawRect(-thickness / 2, -size / 2, thickness, size)
            .endFill();
        this.addChild(cross);

        if (text) {
            const textStyle: TextStyle = new TextStyle({
                fontFamily: 'Arial',
                fontSize: 12,
                fill: 0xffffff,
            });
          
            const label: Text = new Text(text, textStyle);
            label.setTransform(-label.width / 2, -label.height / 2);
            this.addChild(label);
        }
    }
}
