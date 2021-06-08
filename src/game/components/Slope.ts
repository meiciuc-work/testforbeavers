import { SlopeView } from "../graphics/SlopeView";

export default class Slope {
    private slopeView: SlopeView | null = null;
    
    constructor(slopeView: SlopeView) {
        this.slopeView = slopeView;
    }

    public set velocityX(value: number) {
        if (this.slopeView) {
            this.slopeView.velosityX = value;
        }
    }
}