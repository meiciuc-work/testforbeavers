import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { Options } from 'roughjs/bin/core';
import { Point } from 'roughjs/bin/geometry';
import rough from 'roughjs/bundled/rough.cjs.js';
import { GameConfig } from '../GameConfig';

export class BackgroundView extends Container {
    public constructor(private w: number, private h: number) {
        super();
        
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = this.w;
        canvas.height = this.h;

        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

        if (GameConfig.DRAW_ROUGH) {
            // ctx.save();
            // ctx.fillStyle = 'rgb(20, 20, 20)';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            // ctx.restore();

            const gradient = ctx.createLinearGradient(canvas.width, 0, canvas.width * .8, canvas.height * .8);
            gradient.addColorStop(0, 'rgba(0, 0, 0, .9)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const padding = 0;
            
            const options: Options = {
                fill: 'black',
                strokeWidth: .1,
                fillStyle: 'zigzag',
                hachureAngle: -80,
                // roughness: 3,
                // fillWeight: 1,
                hachureGap: 1
            };
            
            const rc = rough.canvas(canvas);
            rc.rectangle(padding, padding, canvas.width + padding * 2, canvas.height + padding * 2, options);

            options.hachureAngle = 60;
            rc.rectangle(padding, padding, canvas.width + padding * 2, canvas.height + padding * 2, options);

            // options.hachureAngle = -85;
            // rc.rectangle(padding, padding, canvas.width + padding * 2, canvas.height + padding * 2, options);

            // options.hachureAngle = 40;
            // rc.rectangle(padding, padding, canvas.width + padding * 2, canvas.height + padding * 2, options);

            // const gradient = ctx.createLinearGradient(canvas.width, 0, 0, canvas.height * .8);
            // gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
            // gradient.addColorStop(1, 'rgba(0, 0, 0, .5)');
            // ctx.fillStyle = gradient;
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const sprite: Sprite = new Sprite(Texture.from(canvas));
        sprite.x = -sprite.width / 2;
        sprite.y = -sprite.height / 2;

        this.addChild(sprite);
    }
}
