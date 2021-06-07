export class GameConfig {

    private static __instanse: GameConfig | null = null;

    public static readonly DEFAULT_LIVES_COUNT = 3;

    public static readonly  DEFAULT_SCREEN_SIZE_AREA = 800 * 600;
    public static readonly  DEFAULT_ASTEROIDS_MIN_COUNT = 2;
    public static readonly  DEFAULT_ASTEROID_MAX_SIZE = 30;

    public static readonly  DEFAULT_CAMERA_SHAKE_MAGNITUDE_FOR_ASTEROID = GameConfig.DEFAULT_ASTEROID_MAX_SIZE / 8;
    public static readonly  DEFAULT_CAMERA_SHAKE_TIME_FOR_ASTEROID = 2;

    public static readonly  DEFAULT_CAMERA_SHAKE_MAGNITUDE_FOR_SPACESHIP = GameConfig.DEFAULT_ASTEROID_MAX_SIZE / 4;
    public static readonly  DEFAULT_CAMERA_SHAKE_TIME_FOR_SPACESHIP = 3;
    
    public static readonly  SCALE_SCREEN_TO_DEFAULT_SCREEN_SIZE_AREA = true;

    public static readonly DRAW_ROUGH = true;

    public screenScale = 1;
    public screenWidth = 0;
    public screenHeight = 0;

    public constructor(width: number, height: number) {
        if (!GameConfig.__instanse) {
            GameConfig.__instanse = this;
            this.screenWidth = width;
            this.screenHeight = height;
        }
    }

    public static get scaleTexture(): number {
        return GameConfig.__instanse!.screenScale;
    }
}
