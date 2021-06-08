import User from "./User";

export default class Client {
    static getLeaders(): Promise<Array<User>> {
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function makeid(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        const arr: Array<User> = [];
        const numb = Math.floor(Date.now() / 100000);
        const length = getRandomInt(0, 10);
        for (let i = 0; i < length; i++) {
            arr.push(new User(makeid(getRandomInt(6, 15)), Math.floor(numb / (10 * (i + 1)))));
        }

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(arr);
            }, 500);
        });
    }



}