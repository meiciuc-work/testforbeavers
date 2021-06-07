import { GameState } from "@/game/components";
import { createModule } from "vuexok";
import store from "./index";

export default createModule(store, "storeGameModule", {
    namespaced: true,
    state: {
        state: GameState.WAIT_FOR_START,
        
        score: 0,
        lives: 0,
        level: 0,
        hits: 0,
        shots: 0,
    },
    mutations: {
        reset(state) {
            state.state = GameState.WAIT_FOR_START;
            state.score = 0;
            state.lives = 0;
            state.level = 0;
        },
        setState(state, value: string) {
            state.state = value;
        },
        setScore(state, value: number) {
            state.score = value;
        },
        setLives(state, value: number) {
            state.lives = value;
        },
        setLevel(state, value: number) {
            state.level = value;
        },
        setHits(state, value: number) {
            state.hits = value;
        },
        setShots(state, value: number) {
            state.shots = value;
        }

    },
    getters: {
        level(state) {
            const { level } = state;
            return level;
        },
        state(storeState) {
            const { state } = storeState;
            return state;
        },
        score(state) {
            const { score } = state;
            return score;
        },
        lives(state) {
            const { lives } = state;
            return lives;
        }
        ,
        hits(state) {
            const { hits } = state;
            return hits;
        },
        shots(state) {
            const { shots } = state;
            return shots;
        }
    }
});
