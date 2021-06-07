export class MoveBackFromScreenEdge {
    public back: boolean;
    public collisionRadius: number;
    
    constructor(collisionRadius = -1) {
        this.collisionRadius = collisionRadius;
        this.back = this.collisionRadius >= 0 ? true : false;
    }
}