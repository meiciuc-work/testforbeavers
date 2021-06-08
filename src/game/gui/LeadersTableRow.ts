import { Container, Sprite, Texture, Text, TextStyle } from 'pixi.js';
import { EntityCreator } from '../EntityCreator';
import User from '../model/User';

export default class LeadersTableRow extends Container {
    
    public constructor(
        protected index: number, 
        protected user: User | null, 
        protected creator: EntityCreator
    ) {
        super();
        
        const backgroundName: Sprite = new Sprite(this.getBackgroundTexture());
        this.addChild(backgroundName);

        if (this.index > 2) {
            const textStyleIndex: TextStyle = new TextStyle({
                fontFamily: 'Arial',
                fontSize: 30,
                fill: 0xffffff,
            });
            const textIndex: Text = new Text(`${this.index + 1}`, textStyleIndex);
            textIndex.position.x = backgroundName.height * .5;
            this.addChild(textIndex);

            backgroundName.position.x += backgroundName.height * 1.5;
        }

        const backgroundScore: Sprite = new Sprite(this.creator.getAssets().getTexture(this.index > 2 ? `midleader_scores_plate` : 'highleader_scores_plate')!);
        backgroundScore.position.x = backgroundName.position.x + backgroundName.width + (this.index > 2 ? backgroundScore.height * .9 : backgroundScore.height * .2);
        backgroundScore.position.y = (backgroundName.height - backgroundScore.height) / 2;
        this.addChild(backgroundScore);

        const textStyleName: TextStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: this.index > 2 ? 30 : 40,
            fill: this.getTextColor()
        });
        const textName: Text = new Text(this.user ? this.user.name : '-', textStyleName);
        textName.position.x = 80;
        textName.position.y = (backgroundName.height - textName.height) / 2;
        this.addChild(textName);

        const textScore: Text = new Text(`${this.user ? this.user.score : '-'}`, textStyleName);
        textScore.anchor.set(0.5, .5);
        textScore.position.x = backgroundScore.x + backgroundScore.width / 2;
        textScore.position.y = (backgroundName.height) / 2;
        this.addChild(textScore);
    }

    private getTextColor(): number {
        switch (this.index) {
            case 0:
                return 0xc16001;
            case 1:
                return 0x205caf;
            case 2:
                return 0x8a1a00;
            default:
                return 0x333333;
        }
    }

    private getBackgroundTexture(): Texture {
        if (this.index < 3) {
            return this.creator.getAssets().getTexture(`place_${this.index + 1}`)!;
        } else {
            return this.creator.getAssets().getTexture(`midleader_name_plate`)!;
        }
    }
}
