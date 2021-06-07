import { createModule } from "vuexok";
import store from "./index";

export default createModule(store, "storeDevelopingModule", {
    namespaced: true,
    state: {
        displayRatio: 1,
        boundingClientRect: '',
        deviceSize: '800x600',
        sceneSize: '800x600',
        scale: 1,
    },
    mutations: {
        reset(state) {
            state.displayRatio = 1;
            state.deviceSize = '';
            state.sceneSize = '';
            state.scale = 1;
        },
        setBoundingClientRect(state, value: string) {
            state.boundingClientRect = value;
        },
        setDiplayRatio(state, value: number) {
            state.displayRatio = value;
        },
        setScale(state, value: number) {
            state.scale = value;
        },
        setDeviceSize(state, value: string) {
            state.deviceSize = value;
        },
        setSceneSize(state, value: string) {
            state.sceneSize = value;
        },
    },
    getters: {
        boundingClientRect(state) {
            const { boundingClientRect: boundingClientRect } = state;
            return boundingClientRect;
        },
        diplayRatio(state) {
            const { displayRatio: diplayRatio } = state;
            return diplayRatio;
        },
        scale(state) {
            const { scale: scale } = state;
            return scale;
        },
        deviceSize(state) {
            const { deviceSize: deviceSize } = state;
            return deviceSize;
        },
        sceneSize(state) {
            const { sceneSize: sceneSize } = state;
            return sceneSize;
        },
    }
});
