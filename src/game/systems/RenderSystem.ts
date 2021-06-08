import { Engine, NodeList, System } from '@ash.ts/ash';
import { AbstractRenderer, Application, Container, Renderer } from 'pixi.js';
import { EntityCreator } from '../EntityCreator';
import { GameConfig } from '../GameConfig';
import { BunnyNode, GUINode, RenderNode } from '../nodes';


interface RenderSystemOptions {
    emitStageEvents: boolean;
}

// TODO must do any Renders for different scopes. Set a PIXI.Container as Param for constructor
export class RenderSystem extends System {
    private resized = false;

    private nodes: NodeList<RenderNode> | null = null;
    private guis: NodeList<GUINode> | null = null;

    private readonly container: HTMLElement;
    private readonly entityCreator: EntityCreator;
    private readonly gameConfig: GameConfig;
    private readonly renderer: Renderer | AbstractRenderer;
    private readonly stage: Container;
    private readonly view: HTMLCanvasElement;

    private readonly gameContainer: Container;
    private readonly guiContainer: Container;

    private options: RenderSystemOptions;

    private deltaX = 0;
    private deltaY = 0;
    private deltaAngle = .1;

    private bunny: NodeList<BunnyNode> | null = null;
    
    public constructor(container: HTMLElement, options: RenderSystemOptions = { emitStageEvents: true }, entityCreator: EntityCreator, gameConfig: GameConfig) {
        super();

        this.container = container;
        this.options = options;
        this.entityCreator = entityCreator;
        this.gameConfig = gameConfig;

        const app = new Application({
            width: this.gameConfig.screenWidth,
            height: this.gameConfig.screenHeight,
            backgroundColor: 0xffffff,
        });

        this.renderer = app.renderer;
        this.renderer.backgroundColor = 0x6e9aca;
        this.stage = app.stage;
        this.view = app.view;

        this.gameContainer = new Container();
        this.gameContainer.setTransform(0, 0, 1, 1, this.deltaAngle);
        this.stage.addChild(this.gameContainer);

        this.guiContainer = new Container();
        this.stage.addChild(this.guiContainer);

        this.entityCreator.registerCameraContainer(this.gameContainer);

        this.resize();
    }

    public addToEngine(engine: Engine): void {
        window.addEventListener('resize', this.handleWindowResize);

        this.container.appendChild(this.view);
        this.nodes = engine.getNodeList(RenderNode);
        for (let node: RenderNode | null = this.nodes.head; node; node = node.next) {
            this.addToDisplay(node);
        }
        this.nodes.nodeAdded.add(this.addToDisplay);
        this.nodes.nodeRemoved.add(this.removeFromDisplay);

        this.guis = engine.getNodeList(GUINode);
        for (let gui: GUINode | null = this.guis.head; gui; gui = gui.next) {
            this.addGUI(gui);
        }
        this.guis.nodeAdded.add(this.addGUI);
        this.guis.nodeRemoved.add(this.removeFromDisplay);

        this.bunny = engine.getNodeList(BunnyNode);
    }

    private addGUI = (node: GUINode): void => {
        const { displayObject } = node.display;
        this.guiContainer.addChild(displayObject);
        this.updateGUI(node);
    }

    private addToDisplay = (node: RenderNode): void => {
        const { displayObject } = node.display;
        this.gameContainer.addChild(displayObject);
        this.updateNode(node);
        if (this.options.emitStageEvents) {
            displayObject.emit('addedToStage');
        }
    }

    private handleWindowResize = (e: Event) => {
        this.resized = true;
    }

    private removeFromDisplay = (node: RenderNode): void => {
        const { displayObject } = node.display;
        if (displayObject.parent) {
            displayObject.parent.removeChild(displayObject);
        }
    }

    public update(time: number): void {
        if (this.resized) {
            this.resized = false;
            this.resize();
        }

        if (this.bunny && this.bunny.head) {
            this.deltaX = Math.round(-1 * this.bunny.head.position.x + this.gameConfig.screenWidth * .3);
            this.deltaY = Math.round(-1 * this.bunny.head.position.y + this.gameConfig.screenHeight * .6);
        } else {
            this.deltaX = Math.round(this.gameConfig.screenWidth * .2);
            this.deltaY = Math.round(this.gameConfig.screenHeight * .6);
        }

        for (let node = this.nodes!.head; node; node = node.next) {
            this.updateNode(node);
        }
        this.renderer.render(this.stage);
    }

    private updateNode(node: RenderNode): void {
        const { display, position } = node;
        display.displayObject.setTransform(position.x + this.deltaX, position.y + this.deltaY, 1, 1, position.rotation);
    }

    private updateGUI(node: GUINode): void {
        const { display, position } = node;
        display.displayObject.setTransform(position.x, position.y, 1, 1, position.rotation);
    }

    private resize(): void {
        const rect: DOMRect = this.container.getBoundingClientRect();
        
        this.gameConfig.screenWidth = rect.width;
        this.gameConfig.screenHeight = rect.height;

        this.renderer.view.style.width = rect.width + 'px';
        this.renderer.view.style.height = rect.height + 'px';
        this.renderer.resize(rect.width, rect.height);
    }

    public removeFromEngine(engine: Engine): void {
        if (this.nodes) {
            this.nodes.nodeAdded.remove(this.addToDisplay);
            this.nodes.nodeRemoved.remove(this.removeFromDisplay);
            this.nodes = null;
        }

        this.container.removeChild(this.view);
    }
}
