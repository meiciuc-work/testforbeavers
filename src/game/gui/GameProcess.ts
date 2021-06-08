import { Text, TextStyle } from 'pixi.js';
import { EntityCreator } from '../EntityCreator';
import BasePopup from './BasePopup';
import Button from './Button';
import ICommand from './ICommand';

export default class GameProcess extends BasePopup implements ICommand{
    public constructor(protected creator: EntityCreator) {
        super(creator);

        this.background.alpha = 0;
    }

    protected setupContent(): void {
        const leftArrow: Button = new Button(
            this.creator.getAssets().getTexture('arrow_btn_active')!,
            this.creator.getAssets().getTexture('arrow_btn_hover')!,
            this.creator.getAssets().getTexture('arrow_btn_press')!
        );
        leftArrow.anchor.set(.5);
        leftArrow.scale.set(-1, 1);
        leftArrow.position.x = 0
        leftArrow.position.y = 0
        leftArrow.signalClick.add(() => { this.handleLeftArrowClick(); });
        this.addChild(leftArrow);

        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 40,
            fill: 0xffffff,
        });
        const label: Text = new Text('Выйти из игры', textStyle);
        label.anchor.set(0, .5);
        label.position.x = leftArrow.width * 1.3;
        label.position.y = 0;
        this.addChild(label);
    }

    protected showPopup(): void {
        this.creator.showPopup(this, 100, 50);
    }

    protected handleLeftArrowClick(): void {
        if (this.resolve) {
            this.resolve(this);
        }
    }
}
