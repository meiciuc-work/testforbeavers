import floor from '../assets/floor.png';
import bunny_flying from '../assets/bunny_flying.png';
import bunny_riding from '../assets/bunny_riding.png';
import stopper_idle from '../assets/stopper_idle.png';
import info_plate_big from '../assets/ui/info_plate_big.png';

import gui_json from '../assets/packs/gui.json';
import gui_png from '../assets/packs/gui.png';
import { Texture } from '@pixi/core';

export default class AssetsLoader {
    private json: any | null = null;
    private map: Map<string, HTMLCanvasElement> = new Map();

    public execute(): Promise<this> {
        const arr: Array<Promise<any>> = [];

        arr.push(this.loadJSON(gui_json));
        arr.push(this.loadImage(floor));
        arr.push(this.loadImage(bunny_flying));
        arr.push(this.loadImage(bunny_riding));
        arr.push(this.loadImage(stopper_idle));
        arr.push(this.loadImage(info_plate_big));
        arr.push(this.loadImage(gui_png));

        return Promise.all(arr)
            .then(() => {
                return Promise.resolve(this)
            });
    }

    private getImageFromMap(fileName: string): HTMLCanvasElement | null {
        const itr: IterableIterator<string> = this.map.keys();

        for (let key: string = itr.next().value; key; key = itr.next().value) {
            if (key.indexOf(fileName) > -1) {
                return this.map.get(key) as HTMLCanvasElement;
            }
        }

        return null;
    }

    public getTexture(fileName: string): Texture | null {
        const canvas: HTMLCanvasElement | null = this.getImageFromMap(fileName);
        if (canvas) {
            return Texture.from(canvas);
        }

        if (this.json.frames[`${fileName}.png`]) {
            const element: any = this.json.frames[`${fileName}.png`];
            const sheet: HTMLCanvasElement | null = this.getImageFromMap('gui');
            
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            canvas.width = element.spriteSourceSize.w;
            canvas.height = element.spriteSourceSize.h;

            const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
            ctx.drawImage(sheet!, 
                element.frame.x, 
                element.frame.y,
                element.frame.w,
                element.frame.h,
                0,
                0,
                canvas.width,
                canvas.height,
            );
            // document.body.appendChild(canvas)
            return Texture.from(canvas);
        }

        return null;
    }

    private loadImage(url: string): Promise<any> {
        return new Promise(resolve => {
            const image: HTMLImageElement = document.createElement('img');
            image.onload = () => {
                const canvas: HTMLCanvasElement = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
                ctx.drawImage(image, 0, 0);
                this.map.set(url, canvas);

                resolve(true);
            }
            image.src = url;
        });
    }

    private loadJSON(url: string): Promise<any> {
        return new Promise(resolve => {
            // const data64 = btoa(JSON.stringify(url));
            // const dataURL = `data:text/json;base64, ${data64}`;

            this.json = url;//dataURL;
    
            resolve(true);
        });
    }
}