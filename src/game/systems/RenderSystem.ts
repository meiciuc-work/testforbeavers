import { Application, Container, Renderer, AbstractRenderer } from 'pixi.js';
import { Engine, NodeList, System } from '@ash.ts/ash';

import { RenderNode, SpaceshipNode } from '../nodes';
import { GameConfig } from '../GameConfig';
import { EntityCreator } from '../EntityCreator';
import storeDevelopingModule from '@/vuex/storeDevelopingModule';

interface RenderSystemOptions {
    emitStageEvents: boolean;
}

export class RenderSystem extends System {
    private resized = false;

    private nodes: NodeList<RenderNode> | null = null;

    private readonly renderer: Renderer | AbstractRenderer;
    private readonly stage: Container;
    private readonly view: HTMLCanvasElement;
    private readonly entityCreator: EntityCreator;
    private readonly gameConfig: GameConfig;

    private container: HTMLElement;

    private options: RenderSystemOptions;

    private spaceship: NodeList<SpaceshipNode> | null = null;
    
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
        this.stage = app.stage;
        this.view = app.view;

        this.entityCreator.registerCameraContainer(this.stage);

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

        this.spaceship = engine.getNodeList(SpaceshipNode);
    }

    private addToDisplay = (node: RenderNode): void => {
        console.log('addToDisplay')
        const { displayObject } = node.display;
        this.stage.addChild(displayObject);
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
        this.stage.removeChild(displayObject);
        if (this.options.emitStageEvents) {
            displayObject.emit('removedFromStage');
        }
    };

    public update(time: number): void {
        if (this.resized) {
            this.resized = false;
            this.resize();
        }

        for (let node = this.nodes!.head; node; node = node.next) {
            this.updateNode(node);
        }
        this.renderer.render(this.stage);
    }

    private updateNode(node: RenderNode): void {
        const { display, position } = node;
        display.displayObject.setTransform(position.x, position.y, 1, 1, position.rotation);
    }

    private resize(): void {
        const rect: DOMRect = this.container.getBoundingClientRect();

        const rectArea = rect.width * rect.height;
        let scale = rectArea / GameConfig.DEFAULT_SCREEN_SIZE_AREA;

        scale = scale < .7 ? .7 : scale;

        this.gameConfig.screenScale = scale;
        this.gameConfig.screenWidth = rect.width / scale;
        this.gameConfig.screenHeight = rect.height / scale;

        this.stage.scale.set(scale, scale);

        this.renderer.view.style.width = rect.width + 'px';
        this.renderer.view.style.height = rect.height + 'px';
        this.renderer.resize(rect.width, rect.height);

        storeDevelopingModule.mutations.setBoundingClientRect(`${rect.x}, ${rect.y}, ${rect.width}, ${rect.height}`);
        storeDevelopingModule.mutations.setDeviceSize(`${window.innerWidth}, ${window.innerHeight}`);
        storeDevelopingModule.mutations.setDiplayRatio(window.devicePixelRatio);
        storeDevelopingModule.mutations.setSceneSize(`${rect.width}, ${rect.height}`);
        storeDevelopingModule.mutations.setScale(scale);
    }

    public removeFromEngine(engine: Engine): void {
        if (this.nodes) {
            this.nodes.nodeAdded.remove(this.addToDisplay);
            this.nodes.nodeRemoved.remove(this.removeFromDisplay);
            this.nodes = null;
        }

        this.spaceship = null;

        this.container.removeChild(this.view);
    }
}
