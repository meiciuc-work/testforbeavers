import { Sprite, Texture } from 'pixi.js';
import signals from 'signals';

export default class Button extends Sprite {
    
    private readonly textureButton: Texture;
    private readonly textureButtonDown: Texture;
    private readonly textureButtonOver: Texture;

    private isDown = false;
    private isOver = false;

    public signalClick: signals.Signal = new signals.Signal();

    public constructor(textureButton: Texture, textureButtonOver: Texture | null = null, textureButtonDown: Texture | null = null) {
        super(textureButton);

        this.textureButton = textureButton;
        this.textureButtonDown = textureButtonDown ? textureButtonDown : textureButton;
        this.textureButtonOver = textureButtonOver ? textureButtonOver : textureButton;
        
        this.interactive = true;
        this.buttonMode = true;

        this.anchor.set(0.5, 0.5);

        this.on('pointerdown', this.onButtonDown)
        .on('pointerup', this.onButtonUp)
        .on('pointerupoutside', this.onButtonUp)
        .on('pointerover', this.onButtonOver)
        .on('pointerout', this.onButtonOut);
    }

    private onButtonDown = (e: Event) => {
        this.isDown = true;
        this.texture = this.textureButtonDown;
    }

    private onButtonUp = (e: Event) => {
        if (this.isDown) {
            this.signalClick.dispatch();
        }
        this.isDown = false;
        if (this.isOver) {
            this.texture = this.textureButtonOver;
        }
        else {
            this.texture = this.textureButton;
        }
    }

    private onButtonOver = (e: Event) => {
        this.isOver = true;
        if (this.isDown) {
            return;
        }
        this.texture = this.textureButtonOver;
    }

    private onButtonOut = (e: Event) => {
        this.isOver = false;
        if (this.isDown) {
            return;
        }
        this.texture = this.textureButton;
    }
}
