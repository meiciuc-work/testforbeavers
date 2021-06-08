export class GameState {

    public static INTRO = 'intro';
    public static PLAY = 'play';
    public static PAUSE = 'pause';
    public static GAME_END = 'end';
    public static LEADERS = 'leaders';

    public state = GameState.INTRO;

    public lives = 0;
    public level = 0;
    public hits = 0;
    public shots = 0;

    public setForStart(): void {
        this.lives = 3;
        this.level = 0;
        this.hits = 0;
        this.shots = 0;
        this.state = GameState.PLAY;
    }

    public setForFinish(): void {
        this.state = GameState.GAME_END;
    }

    public update(gameState: GameState): void {
        this.lives = gameState.lives;
        this.level = gameState.level;
        this.hits = gameState.hits;
        this.shots = gameState.shots;
        this.state = gameState.state;
    }
}
