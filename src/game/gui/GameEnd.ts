import { Container, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { EntityCreator } from '../EntityCreator';
import BasePopup from './BasePopup';
import Button from './Button';
import ICommand from './ICommand';

export default class GameEnd extends BasePopup implements ICommand{

    private score: Text | null = null;
    private coins: Text | null = null;
    private distance: Text | null = null;

    public constructor(protected creator: EntityCreator) {
        super(creator);

        this.title.text = 'Твои очки:'
    }

    protected setupContent(): void {
        const ok: Button = new Button(
            this.creator.getAssets().getTexture('ok_button_active')!,
            this.creator.getAssets().getTexture('ok_button_hover')!,
            this.creator.getAssets().getTexture('ok_button_press')!
        );
        
        ok.anchor.set(.5);
        ok.position.x = this.background.width / 2;
        ok.position.y = (this.background.height - ok.height * .9);
        ok.signalClick.add(() => { this.handleOk(); });
        this.background.addChild(ok);

        let textStyle: TextStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 60,
            fill: 0xffffff,
        });
        this.score = new Text('очки', textStyle);
        this.score.anchor.set(.5);
        this.score.position.x = this.background.width * .5;
        this.score.position.y = this.background.height * .2;
        this.background.addChild(this.score);

        textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 60,
            fill: 0xf4ad25,
        });
        this.coins = new Text('монеты', textStyle);
        this.coins.anchor.set(.5);
        this.coins.position.x = this.background.width * .5;
        this.coins.position.y = this.background.height * .4;
        this.background.addChild(this.coins);

        textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 60,
            fill: 0x9ac6ff,
        });
        this.distance = new Text('дистанция', textStyle);
        this.distance.anchor.set(.5);
        this.distance.position.x = this.background.width * .5;
        this.distance.position.y = this.background.height * .6;
        this.background.addChild(this.distance);

        const coin: Sprite = new Sprite(this.creator.getAssets().getTexture('collect_coin_icon')!);
        coin.anchor.set(0, .5);
        coin.position.x = this.background.width * .1;
        coin.position.y = this.coins.y;
        this.background.addChild(coin);

        const distance: Sprite = new Sprite(this.creator.getAssets().getTexture('collect_distance_icon')!);
        distance.anchor.set(0, .5);
        distance.position.x = coin.x;
        distance.position.y = this.distance.y;
        this.background.addChild(distance);
    }

    private handleOk(): void {
        if (this.resolve) {
            this.resolve(this);
        }    
    }

    private handleClick = (event): void => {
        if (this.resolve) {
            this.resolve();
        }
    }
}
