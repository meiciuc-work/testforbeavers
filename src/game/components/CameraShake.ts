import { DisplayObject } from "@pixi/display";
import { Animatable } from '../graphics/Animatable';

export class CameraShake implements Animatable {
    public readonly displayObject: DisplayObject;

    startX = 0
    startY = 0;
    startAngle = 0;

    magnitude = 16;
    tiltAngle = 1;

    constructor(displayObject: DisplayObject, magnitude = 16, private time = 1) {
        this.displayObject = displayObject;
        this.magnitude = magnitude;

        this.startX = displayObject.x;
        this.startY = displayObject.y;
        this.startAngle = displayObject.rotation;
    }

    animate(time: number): void {
        this.time -= time;
        this.upAndDownShake();
        // this.angularShake();
    }

    upAndDownShake(): void {
        const sprite: DisplayObject = this.displayObject;
        if (this.time >= 0) {
            sprite.x = this.startX;
            sprite.y = this.startY;
            
            const magnitude = this.magnitude * this.time;

            sprite.x += this.randomInt(-magnitude, magnitude);
            sprite.y += this.randomInt(-magnitude, magnitude);
        } else {
            sprite.x = this.startX;
            sprite.y = this.startY;
        }
    }

    angularShake() {
        const sprite: DisplayObject = this.displayObject;
        if (this.time >= 0) {
            const magnitude = this.magnitude * this.time;

            sprite.rotation = this.startAngle + magnitude * this.tiltAngle / 100;
            this.tiltAngle *= -1;
        } else {
            sprite.rotation = this.startAngle;
        }
    }


randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

}