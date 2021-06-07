declare const vkBridge: any;
declare const VK: any;

interface VKBridgeResponce {
    type: string;
    data: {[key: string]: any};
}

export default class VKBridge {

    private viewportWidth = 0;

    constructor() {
        Promise.all([this.setupBridge(), this.setupVK()])
            .then(() => {
                this.setupIFrame();
            })
            .catch((error) => {
                const err = error;
            })
    }

    private handleBridgeSubscribe(e: VKBridgeResponce): void {
        console.log("vkBridge event", e)
        switch (e.type) {
            case 'VKWebAppUpdateConfig':
                console.log('e.data.viewport_width, e.data.viewport_height', e.data.viewport_width, e.data.viewport_height);
                this.viewportWidth = e.data.viewport_width;
            break;
            case 'VKWebAppResizeWindowResult':
                console.log('VKWebAppResizeWindowResult', e.data.width, e.data.height);
            break;
        }
    }

    private handleOnScrollTop(vkScrollPos: number, vkHeight: number, vkOffset: number): void {
        console.log('handleOnScrollTop', vkHeight)
        // vkBridge.send("VKWebAppResizeWindow", {"width": this.viewportWidth, "height": vkHeight - 50});
    }

    private setupBridge(): Promise<any> {
        return new Promise((resolve, reject) => {
            const unsubscribe = () => {
                vkBridge.unsubscribe(unsubscribe);
                resolve(true);
            };

            vkBridge.subscribe(unsubscribe);
            vkBridge.subscribe((e: any) => {this.handleBridgeSubscribe(e);});
            vkBridge.send("VKWebAppInit", {});
        });
    }

    private setupVK(): Promise<any> {
        return new Promise((resolve, reject) => {
            VK.init(
                () => {resolve(true);},
                () => {reject(false);},
                '5.130'
            );
        });
    }

    private setupIFrame(): void {
        VK.addCallback("onScrollTop", (vkScrollPos: number, vkHeight: number, vkOffset: number) => {
            this.handleOnScrollTop(vkScrollPos, vkHeight, vkOffset);
        });
        VK.callMethod("scrollTop");
    }
}