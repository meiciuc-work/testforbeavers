import { Container, TextStyle, Text, Sprite } from 'pixi.js';
import { EntityCreator } from '../EntityCreator';
import { GameConfig } from '../GameConfig';
import Client from '../model/Client';
import User from '../model/User';
import Button from './Button';
import ICommand from './ICommand';
import LeadersTableRow from './LeadersTableRow';

export default class Leaders extends Container implements ICommand {

    static TABLE_ROWS_COUNT = 10;
    protected tables: Array<string> = ['Всё время', 'Mесяц', 'Неделя'];
    protected currentTable = 0;
    protected currentTableText: Text | null = null;
    protected leftArrow: Button | null = null;
    protected rightArrow: Button | null = null;

    protected table: Container | null = null;

    protected resolve: Function | null = null;
    protected reject: Function | null = null;

    protected background: Sprite;
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

        this.title.text = 'Таблица рекордов:';

        this.table = new Container();
        this.background.addChild(this.table);

        setTimeout(() => {
            this.updateTable();    
        }, 100);
        
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

        const textStyle: TextStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 60,
            fill: 0xff6801,
        });
        this.currentTableText = new Text('Всё время', textStyle);
        this.currentTableText.anchor.set(.5);
        this.currentTableText.position.x = this.background.width * .5;
        this.currentTableText.position.y = this.background.height * .15;
        this.background.addChild(this.currentTableText);

        this.leftArrow = new Button(
            this.creator.getAssets().getTexture('arrow_btn_active')!,
            this.creator.getAssets().getTexture('arrow_btn_hover')!,
            this.creator.getAssets().getTexture('arrow_btn_press')!
        );
        this.leftArrow.anchor.set(.5);
        this.leftArrow.scale.set(-1, 1);
        this.leftArrow.position.x = this.background.width * .15;
        this.leftArrow.position.y = this.currentTableText.y;
        this.leftArrow.signalClick.add(() => { this.handleLeftArrowClick(); });
        this.background.addChild(this.leftArrow);

        this.rightArrow = new Button(
            this.creator.getAssets().getTexture('arrow_btn_active')!,
            this.creator.getAssets().getTexture('arrow_btn_hover')!,
            this.creator.getAssets().getTexture('arrow_btn_press')!
        );
        this.rightArrow.anchor.set(.5);
        this.rightArrow.position.x = this.background.width - this.leftArrow.x;
        this.rightArrow.position.y = this.currentTableText.y;
        this.rightArrow.signalClick.add(() => { this.handleRightArrowClick(); });
        this.background.addChild(this.rightArrow);
    }

    protected updateTable (): void {
        this.table!.removeChildren();

        if (this.currentTableText) {
            this.currentTableText.text = this.tables[this.currentTable];
        }

        const textStyle: TextStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 40,
            fill: 0x333333,
        });
        const loading: Text = new Text('Загрузка...', textStyle);
        loading.anchor.set(.5);
        loading.position.x = this.background.width * .5;
        loading.position.y = this.background.height * .5;
        this.background.addChild(loading);

        Client.getLeaders()
            .then((arr: Array<User>) => {
                if (loading) {
                    loading.parent.removeChild(loading);
                }
                // let lastY = this.background.height * .27;
                let lastY = this.currentTableText!.y + this.currentTableText!.height / 2;
                for (let i = 0; i < Leaders.TABLE_ROWS_COUNT; i++) {
                    const user: User | null = arr.length > i ? arr[i] : null;
                    const row: LeadersTableRow = new LeadersTableRow(i, user, this.creator);
                    row.position.y = lastY + (i > 2 ? row.height * .1 : 0);
                    row.position.x = this.leftArrow!.position.x - this.leftArrow!.width * 1.5;
                    lastY = row.position.y + row.height;
                    this.table?.addChild(row);
                }
            });
    }

    protected handleLeftArrowClick(): void {
        this.currentTable++;
        this.currentTable = this.currentTable >= this.tables.length ? 0 : this.currentTable;
        this.updateTable();
    }

    protected handleRightArrowClick(): void {
        this.currentTable--;
        this.currentTable = this.currentTable < 0 ? this.tables.length - 1 : this.currentTable;
        this.updateTable();
    }

    protected handleOk(): void {
        if (this.resolve) {
            this.resolve(this);
        }    
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
