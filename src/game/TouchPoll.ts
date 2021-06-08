export class TouchPoll {

    private mouseDown = false;
    private mouseDownX = 0;
    private mouseDownY = 0;
    private mouseDownTimestamp = 0;
    private mouseDownRadius = 20;

    private mouseMoveX = 0;
    private mouseMoveY = 0;
    
    private clickTimeout = 500;

    private distance = 0;

    private mouseLeft = false;
    private mouseRight = false;
    private mouseTop = false;
    private mouseBottom = false;

    public constructor() {
        window.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);

        document.body.addEventListener('touchstart', this.handleTouchStart);
        document.body.addEventListener('touchend', this.handleTouchEnd);
        document.body.addEventListener('touchmove', this.handleTouchMove);
    }

    private handleTouchStart = (event: TouchEvent) => {
        for (let i = 0; i < event.touches.length; i++) {
            this.mouseDown = true;
            this.mouseDownX = (event.touches[i] as Touch).clientX;
            this.mouseDownY = (event.touches[i] as Touch).clientY;
            this.mouseDownTimestamp = Date.now();
            break;
        }
    }

    private handleTouchEnd = (event: TouchEvent) => {
        this.handleTouchMove(event);
        this.mouseDown = false;
        this.resetDirections();
    }

    private handleTouchMove = (event: TouchEvent) => {
        if (this.mouseDown) {
            for (let i = 0; i < event.touches.length; i++) {
                this.mouseMoveX = event.touches[0].clientX;
                this.mouseMoveY = event.touches[0].clientY;
                this.distance = this.getDistance(this.mouseDownX, this.mouseDownY, this.mouseMoveX, this.mouseMoveY);
                if (this.distance > this.mouseDownRadius) {
                    if (this.mouseDownY - this.mouseMoveY > this.mouseDownRadius) {
                        this.mouseTop = true;
                    } else if (this.mouseDownX - this.mouseMoveX > this.mouseDownRadius ) {
                        this.mouseLeft = true;
                    } else if (this.mouseMoveX - this.mouseDownX > this.mouseDownRadius) {
                        this.mouseRight = true;
                    } else {
                        this.mouseBottom = true;
                    }
                } else {
                    this.resetDirections();
                }
                break;
            }
            
        }
    }

    private handleMouseDown = (event: MouseEvent) => {
        this.mouseDown = true;
        this.mouseDownX = event.clientX;
        this.mouseDownY = event.clientY;
        this.mouseDownTimestamp = Date.now();
    }

    private handleMouseUp = (event: MouseEvent) => {
        this.handleMouseMove(event);
        this.mouseDown = false;
        this.resetDirections();
    }

    private handleMouseMove = (event: MouseEvent) => {
        if (this.mouseDown) {
            this.mouseMoveX = event.clientX;
            this.mouseMoveY = event.clientY;
            this.distance = this.getDistance(this.mouseDownX, this.mouseDownY, this.mouseMoveX, this.mouseMoveY);
            if (this.distance > this.mouseDownRadius) {
                if (this.mouseDownY - this.mouseMoveY > this.mouseDownRadius) {
                    this.mouseTop = true;
                } else if (this.mouseDownX - this.mouseMoveX > this.mouseDownRadius ) {
                    this.mouseLeft = true;
                } else if (this.mouseMoveX - this.mouseDownX > this.mouseDownRadius) {
                    this.mouseRight = true;
                } else {
                    this.mouseBottom = true;
                }
            } else {
                this.resetDirections();
            }
        }
    }

    private getDistance(x1: number, y1: number, x2: number, y2: number): number {
        const a = x1 - x2;
        const b = y1 - y2;
        return Math.sqrt( a * a + b * b );
    }

    private resetDirections(): void {
        this.mouseLeft = false;
        this.mouseRight = false;
        this.mouseTop = false;
        this.mouseBottom = false;
    }

    get left(): boolean {
        return this.mouseLeft;
    }
    get right(): boolean {
        return this.mouseRight;
    }
    get top(): boolean {
        return this.mouseTop;
    }
    get down(): boolean {
        return this.mouseBottom;
    }
    get click(): boolean {
        return !this.mouseDown 
            && Date.now() - this.mouseDownTimestamp <= this.clickTimeout 
            && this.distance < this.mouseDownRadius
        ;
    }
}