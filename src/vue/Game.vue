<template>
    <div @click="handleClick">
        <div class="options wrap_container">
            <ul class="results">
                <li class="subtitle has-text-white game-score">LEVEL: {{$store.state.storeGameModule.level}}</li>
                <li class="subtitle has-text-white game-score">SCORE: {{$store.state.storeGameModule.score}}</li>
                <li class="subtitle has-text-white game-lives">LIVES: {{$store.state.storeGameModule.lives}}</li>
                <li class="subtitle has-text-white game-lives">shots: {{$store.state.storeGameModule.shots}}</li>
                <li class="subtitle has-text-white game-lives">hits: {{$store.state.storeGameModule.hits}}</li>
                <li class="subtitle has-text-white game-lives">precision: {{precision}}</li>
                <li class="subtitle has-text-white game-lives">---------------</li>
                <li class="subtitle has-text-white game-lives">boundingClientRect: {{$store.state.storeDevelopingModule.boundingClientRect}}</li>
                <li class="subtitle has-text-white game-lives">deviceSize: {{$store.state.storeDevelopingModule.deviceSize}}</li>
                <li class="subtitle has-text-white game-lives">displayRatio: {{$store.state.storeDevelopingModule.displayRatio}}</li>

                <li class="subtitle has-text-white game-lives">scale: {{$store.state.storeDevelopingModule.scale}}</li>
                <li class="subtitle has-text-white game-lives">sceneSize: {{$store.state.storeDevelopingModule.sceneSize}}</li>
            </ul>
            
            
            <div v-if="start" class="center">
                <div>
                    <h1>ASTEROIDS</h1>
                    <h2>Click to start</h2>
                </div>
            </div>

            <div v-if="finish" class="center">
                <div>
                    <h1>GAME OVER</h1>
                    <h2>Click to start</h2>
                </div>
            </div>
        </div>
        <div class="game wrap_container" ref="game"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { asteroids } from '@/game/Asteroids';
import storeGameModule from '@/vuex/storeGameModule';
import { GameState } from '@/game/components';

@Component({
  components: {}
})
export default class Game extends Vue {
    mounted() {
        storeGameModule.mutations.reset();
        setTimeout(() => {
            asteroids(this.$refs.game as HTMLElement);
        }, 100);
    }

    destroyed() {
        console.log('Game', 'destroyed')
    }

    private get start(): boolean {
        return storeGameModule.getters.state == GameState.WAIT_FOR_START;
    }

    private get finish(): boolean {
        return storeGameModule.getters.state == GameState.FINISH;
    }

    private get precision(): string {
        const result = Math.floor((storeGameModule.getters.hits / storeGameModule.getters.shots) * 100);
        return result ? `${result}%` : '';
    }

    private handleClick(): void {
        if (
            storeGameModule.getters.state == GameState.WAIT_FOR_START
            || storeGameModule.getters.state == GameState.FINISH
        ) {
            storeGameModule.mutations.setState(GameState.PLAY);
        }
    }
}
</script>

<style lang="stylus" scoped>
    .game
        z-index -1
    
    .center
        position absolute
        width 100%
        height 100vh
        display flex
        justify-content: center;
        align-items: center;
    
    .options
        position absolute
        color white
        font-size 1.2em

        .results
            margin 30px
            li
                padding 3px
</style>
