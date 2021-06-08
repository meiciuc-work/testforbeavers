import { Engine, NodeList, System } from '@ash.ts/ash';
import { GameState } from '../components';
import { GameNode } from '../nodes';

export class HudSystem extends System {
    
    private game: NodeList<GameNode> | null = null;
    private gameState: GameState = new GameState();
    
    addToEngine(engine: Engine): void {
        this.game = engine.getNodeList(GameNode);
    }
    removeFromEngine(engine: Engine): void {
        this.game = null;
    }
    update(time: number): void {
        const state: GameState | null | undefined = this.game?.head?.state;
        if (!state) {
            return;
        }

        // if (storeGameModule.getters.state != this.gameState.state) {
        //     if (
        //         (this.gameState.state == GameState.WAIT_FOR_START || this.gameState.state == GameState.FINISH)
        //         && storeGameModule.getters.state == GameState.PLAY
        //     ) {
        //         this.gameState.setForStart();
        //         state.setForStart();
        //     } else if (storeGameModule.getters.state == GameState.FINISH) {
        //         this.gameState.setForFinish();
        //         state.setForFinish();
        //     } else {
        //         this.gameState.state = storeGameModule.getters.state;
        //         state.state = this.gameState.state;
        //     }
        // } else {
        //     if (state.state != this.gameState.state) {
        //         this.gameState.state = state.state;
        //         storeGameModule.mutations.setState(state.state);
        //     }
    
        //     storeGameModule.mutations.setLives(state.lives);
        //     storeGameModule.mutations.setLevel(state.level);
        //     storeGameModule.mutations.setShots(state.shots);
        //     storeGameModule.mutations.setHits(state.hits);
        // }

        this.gameState.update(state);
    }
}
