<template>
    <div>
        <div class="game wrap_container" ref="game"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { game } from '@/game/Game';
import { GameState } from '@/game/components';

@Component({
  components: {}
})
export default class Game extends Vue {
    mounted() {
        setTimeout(() => {
            game(this.$refs.game as HTMLElement);
        }, 100);
    }

    destroyed() {
        console.log('Game', 'destroyed')
    }

    private handleClick(): void {
        console.log(' CLICK')
    }
}
</script>

<style lang="stylus" scoped>
    // .game
    //     z-index -1
</style>
