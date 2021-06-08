import { Sprite, Text, TextStyle } from 'pixi.js';
import { EntityCreator } from '../EntityCreator';
import BasePopup from './BasePopup';
import Button from './Button';
import ICommand from './ICommand';

export default class Intro extends BasePopup implements ICommand{
    
    private record: Text | null = null;
    private userName: Text | null = null;
    
    public constructor(protected creator: EntityCreator) {
        super(creator);

        this.title.text = 'Твои рекорды:'
    }

    protected setupContent(): void {
        const leadboard: Button = new Button(
            this.creator.getAssets().getTexture('leadboard_button_active')!,
            this.creator.getAssets().getTexture('leadboard_button_hover')!,
            this.creator.getAssets().getTexture('leadboard_button_press')!
        );

        leadboard.position.x = (this.background.width - leadboard.width) / 2 * .95;
        leadboard.position.y = (this.background.height - leadboard.height * .9);
        leadboard.signalClick.add(() => { this.handleLeaders() });
        this.background.addChild(leadboard);
        
        const play: Button = new Button(
            this.creator.getAssets().getTexture('play_button_active')!,
            this.creator.getAssets().getTexture('play_button_hover')!,
            this.creator.getAssets().getTexture('play_button_press')!
        );

        play.position.x = this.background.width - leadboard.position.x;
        play.position.y = leadboard.y;
        play.signalClick.add(() => { this.handlePlay(); });
        this.background.addChild(play);

        const userName: Sprite = new Sprite(this.creator.getAssets().getTexture('user_name_bar')!);
        userName.position.x = (this.background.width - userName.width) / 2;
        userName.position.y = this.background.height / 2 + userName.height / 2;
        this.background.addChild(userName);

        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 60,
            fill: 0xffffff,
        });
        this.record = new Text('Рекорд: 3981', textStyle);
        this.record.anchor.set(.5);
        this.record.position.x = this.background.width * .5;
        this.record.position.y = this.background.height * .3;
        this.background.addChild(this.record);

        this.userName = new Text('Guest_NEMO', textStyle);
        this.userName.anchor.set(0, 0);
        this.userName.position.x = userName.position.x * 1.3;
        this.userName.position.y = userName.position.y + (userName.height - this.userName.height) / 2;
        this.background.addChild(this.userName);
    }

    private handlePlay(): void {
        if (this.resolve) {
            this.resolve(this);
        }    
    }

    private handleLeaders(): void {
        if (this.reject) {
            this.reject(this);
        }    
    }
}