import { BaseTexture, Container, Graphics, Sprite, Texture } from 'pixi.js';
import rough from 'roughjs/bundled/rough.cjs.js';
import { Options } from 'roughjs/bin/core';
import { Point } from 'roughjs/bin/geometry';
import { GameConfig } from '../GameConfig';

export class SpaceshipView extends Container {
    public constructor() {
        super();

        if (GameConfig.DRAW_ROUGH) {
            const scale = 1;//GameConfig.scaleTexture;
            const padding = 1;
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            
            canvas.width = (17 + padding * 2) * scale;
            canvas.height = (14 + padding * 2) * scale;

            const dx = 7 + padding;
            const dy = 7 + padding;
            const path: Array<Point> = [[10, 0], [-7, 7], [-4, 0], [-7, -7], [10, 0]];
            for (let i = 0; i < path.length; i++) {
                path[i][0] = (path[i][0] + dx) * scale;
                path[i][1] = (path[i][1] + dy) * scale;
            }

            const options: Options = {
                fill: 'red',
                stroke: 'blue',
                fillStyle: 'solid',
                // fillWeight: 4,
                strokeWidth: 2,
                // hachureGap: 6,
                // hachureAngle: 90,
            };
            const rc = rough.canvas(canvas);
            
            rc.polygon(path, options);

            const sprite: Sprite = new Sprite(Texture.from(canvas));
            sprite.x = -sprite.width / 2;
            sprite.y = -sprite.height / 2;
            this.addChild(sprite);
        } else {
            const gr: Graphics = new Graphics();
            gr.moveTo(10, 0).beginFill(0xffffff).lineTo(-7, 7).lineTo(-4, 0)
                .lineTo(-7, -7)
                .lineTo(10, 0)
                .endFill();
            this.addChild(gr);
        }
    }
}
