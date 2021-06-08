import { Container, Graphics, Texture, Text, TextStyle, Sprite } from 'pixi.js';
import { GameConfig } from '../GameConfig';
import { Animatable } from './Animatable';

export class SlopeView extends Container implements Animatable {

    private readonly MIN_TILES_COUNT = 4;
    private WIDTH = 512;
    private HEIGHT = 64;
    private tiles: Array<Container> = [];
    private left = 0;

    public velosityX = 0;

    public constructor(private texture: Texture) {
        super();

        this.scale.set(.5);

        this.WIDTH = this.texture.width;
        this.HEIGHT = this.texture.height;

        const length = Math.max(this.MIN_TILES_COUNT, 2 * Math.floor(GameConfig.screenWidth / this.WIDTH));
        this.left = -1 * (length * this.WIDTH) / 2;

        const tile: Sprite = this.getTile(0 + '');
        tile.setTransform(this.left);
        this.tiles.push(tile);
        this.addChild(tile);

        for (let i = 1; i < length; i++) {
            const tile: Sprite = this.getTile(i + '');
            tile.setTransform(this.tiles[this.tiles.length - 1].x + this.WIDTH);
            this.tiles.push(tile);
            this.addChild(tile);
        }
    }

    private getTile(text: string): Sprite {
        const sprite: Sprite = new Sprite(this.texture);

        return sprite;
    }

    public animate(time: number): void {
        
        if (!this.tiles.length) {
            return;
        }
        this.tiles[0].setTransform(this.tiles[0].x + this.velosityX * time);

        for (let i = 1; i < this.tiles.length; i++) {
            this.tiles[i].setTransform(this.tiles[i - 1].x + this.WIDTH, 0);
        }

        if (this.tiles[0].x <= this.left - this.WIDTH) {
            this.tiles[0].setTransform(this.tiles[this.tiles.length - 1].x + this.WIDTH, 0);
            this.tiles.push(this.tiles.shift()!);
            this.addChild(this.tiles[this.tiles.length - 1]);
        }
    }
}
