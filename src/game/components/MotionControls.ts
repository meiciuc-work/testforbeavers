export class MotionControls {

    public left: number;
    public right: number;
    public top: number;
    public down: number;

    public constructor(
        left = 0,
        right = 0,
        top = 0,
        down = 0,
    ) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.down = down;
    }
}
