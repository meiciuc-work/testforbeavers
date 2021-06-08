import { Engine, NodeList, System } from '@ash.ts/ash';
import { GameState } from '../components';
import Bunny from '../components/Bunny';
import { EntityCreator } from '../EntityCreator';
import { GameConfig } from '../GameConfig';
import GameEnd from '../gui/GameEnd';
import GameProcess from '../gui/GameProcess';
import Intro from '../gui/Intro';
import Leaders from '../gui/Leaders';
import { BunnyNode, GameNode } from '../nodes';

export class GameManager extends System {
    private config: GameConfig;
    private creator: EntityCreator;

    private games: NodeList<GameNode> | null = null;
    private bunny: NodeList<BunnyNode> | null = null;
    
    private currentGameState = '';

    public constructor(creator: EntityCreator, config: GameConfig) {
        super();
        this.creator = creator;
        this.config = config;
    }

    public addToEngine(engine: Engine): void {
        this.games = engine.getNodeList(GameNode);
        this.bunny = engine.getNodeList(BunnyNode);
    
        this.createGameView();
    }

    public removeFromEngine(engine: Engine): void {
        this.games = null;
    }

    public update(time: number): void {
        const gameNode = this.games!.head;
        if (!gameNode || !gameNode.state.state || gameNode.state.state == this.currentGameState) {
            return;
        }

        switch (gameNode.state.state) {
            case GameState.INTRO:
                if (this.bunny && this.bunny.head) {
                    this.bunny.head.bunny.fsm.changeState(Bunny.IDLE)
                }
                this.creator.cameraBlur(true);
                new Intro(this.creator).execute()
                    .then(() => {
                        this.creator.changeGameState(GameState.PLAY);
                    })
                    .catch(() => {
                        this.creator.changeGameState(GameState.LEADERS);
                    })
            break;
            case GameState.PLAY:
                setTimeout(() => {
                    if (this.bunny && this.bunny.head && gameNode.state.state == GameState.PLAY) {
                        this.bunny.head.bunny.fsm.changeState(Bunny.RIDING)
                    }    
                }, 500);
                
                this.creator.cameraBlur(false);
                new GameProcess(this.creator).execute()
                    .then(() => {
                        this.creator.changeGameState(GameState.GAME_END);
                    });
            break;
            case GameState.PAUSE:
                // this.creator.showPause();
            break;
            case GameState.GAME_END:
                if (this.bunny && this.bunny.head) {
                    this.bunny.head.bunny.fsm.changeState(Bunny.IDLE)
                }
                this.creator.cameraBlur(true);
                new GameEnd(this.creator).execute()
                    .then(() => {
                        this.creator.changeGameState(GameState.LEADERS);
                    });
            break;
            case GameState.LEADERS:
                if (this.bunny && this.bunny.head) {
                    this.bunny.head.bunny.fsm.changeState(Bunny.IDLE)
                }
                this.creator.cameraBlur(true);
                new Leaders(this.creator).execute()
                    .then(() => {
                        this.creator.changeGameState(GameState.INTRO);
                    });
            break;
        }

        this.currentGameState = gameNode.state.state;
    }

    private createGameView(): void {
        setTimeout(() => {
            this.creator.createBunny();
        }, 100);
    }
}