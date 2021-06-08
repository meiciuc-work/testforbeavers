export class GameConfig {

    private static __instanse: GameConfig | null = null;

    public static readonly DEFAULT_LIVES_COUNT = 3;

    public static readonly  DEFAULT_SCREEN_WIDTH = 800;
    public static readonly  DEFAULT_SCREEN_HEIGHT = 600;
    public static readonly  DEFAULT_SCREEN_SIZE_AREA =GameConfig.DEFAULT_SCREEN_WIDTH * GameConfig.DEFAULT_SCREEN_HEIGHT;
    public static readonly  DEFAULT_ASTEROIDS_MIN_COUNT = 2;
    public static readonly  DEFAULT_ASTEROID_MAX_SIZE = 30;

    public static readonly  DEFAULT_CAMERA_SHAKE_MAGNITUDE_FOR_ASTEROID = GameConfig.DEFAULT_ASTEROID_MAX_SIZE / 8;
    public static readonly  DEFAULT_CAMERA_SHAKE_TIME_FOR_ASTEROID = 2;

    public static readonly  DEFAULT_CAMERA_SHAKE_MAGNITUDE_FOR_SPACESHIP = GameConfig.DEFAULT_ASTEROID_MAX_SIZE / 4;
    public static readonly  DEFAULT_CAMERA_SHAKE_TIME_FOR_SPACESHIP = 3;
    
    public static readonly  SCALE_SCREEN_TO_DEFAULT_SCREEN_SIZE_AREA = true;

    public static readonly DRAW_ROUGH = true;

    public screenScale = 1;
    public screenWidth = GameConfig.DEFAULT_SCREEN_WIDTH;
    public screenHeight = GameConfig.DEFAULT_SCREEN_HEIGHT;

    public floorElementWidth = 400;
    public floorElementHeight = 300;

    public constructor(width: number, height: number) {
        if (!GameConfig.__instanse) {
            GameConfig.__instanse = this;
            this.screenWidth = width;
            this.screenHeight = height;
        }
    }

    public static get screenWidth(): number {
        return GameConfig.__instanse ? GameConfig.__instanse.screenWidth : GameConfig.DEFAULT_SCREEN_WIDTH;
    }

    public static get screenHeight(): number {
        return GameConfig.__instanse ? GameConfig.__instanse.screenHeight : GameConfig.DEFAULT_SCREEN_HEIGHT;
    }

    public static get scaleTexture(): number {
        return GameConfig.__instanse!.screenScale;
    }

    public static get floorElementWidth(): number {
        return GameConfig.__instanse ? GameConfig.__instanse.floorElementWidth : 400;
    }

    public static get floorElementHeight(): number {
        return GameConfig.__instanse ? GameConfig.__instanse.floorElementHeight : 300;
    }

}
