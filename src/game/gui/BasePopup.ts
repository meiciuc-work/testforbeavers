import { Container, Sprite, Text, TextStyle } from 'pixi.js';
import { EntityCreator } from '../EntityCreator';
import { GameConfig } from '../GameConfig';
import ICommand from './ICommand';

export default class BasePopup extends Container implements ICommand {
    protected resolve: Function | null = null;
    protected reject: Function | null = null;

    protected background: Sprite
    protected title: Text;

    public constructor(protected creator: EntityCreator) {
        super();

        const padding = Math.min(GameConfig.screenHeight, GameConfig.screenWidth) * 0.1;
        const maxWidth = GameConfig.screenWidth - padding * 2;
        const maxHeight = GameConfig.screenHeight - padding * 2;

        this.background = this.setupBackground();
        this.title = this.setupTitle();

        this.setupContent();

        const scale = Math.min(maxWidth / this.background.width, maxHeight / this.background.height);
        this.background.scale.set(scale);
    }

    execute(): Promise<this> {
        this.showPopup();

        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    protected showPopup(): void {
        this.creator.showPopup(this, (GameConfig.screenWidth - this.width) / 2, (GameConfig.screenHeight - this.height) / 2);
    }

    protected setupContent(): void {
        console.log('expand it')
    }

    private setupBackground(): Sprite {

        const sprite: Sprite = new Sprite(this.creator.getAssets().getTexture('info_plate_big')!);

        const title: Sprite = new Sprite(this.creator.getAssets().getTexture('header_info_plate')!);
        title.position.x = (sprite.width - title.width) / 2;
        title.position.y = 5;
        sprite.addChild(title);

        this.addChild(sprite);

        return sprite;
    }

    private setupTitle(): Text {
        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 60,
            fill: 0x000099,
        });

        const text: Text = new Text('', textStyle);
        text.anchor.set(0.5);
        text.setTransform(this.background.width / 2, text.height / 2 + 5);

        this.background.addChild(text);
        return text;
    }
}
