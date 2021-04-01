import {io} from 'socket.io-client';
import Crypto from '@app/config/Crypto';
import {Alert} from '@app/libs/dialog/DialogProvider';
const interval = 30000;
const TAG = 'Socket =>';

//todo fix me
const timeout = new Map();

function startTimeout(id, reject) {
    const to = setTimeout(() => {
        stopTimeout(id);
        reject({success: false, message: 'Request Timeout'});
    }, interval);
    timeout.set(id, to);
}

function stopTimeout(id) {
    const t = timeout.get(id);
    clearTimeout(t);
    timeout.delete(id);
}

class Socket {
    socketApp;
    url = '';
    opt;
    onConnect;
    onDisconnect;
    onError;

    setUrl(url) {
        this.url = url;
    }

    constructor(onConnected, onDisconnect, onError) {
        this.onConnect = onConnected;
        this.onDisconnect = onDisconnect;
        this.onError = onError;
    }

    setOptions(opt: {isLogin: false, ...obj}) {
        if (opt.hasOwnProperty('isLogin') && opt.isLogin) {
            this.opt = Crypto.enc(this.genQuery(true, opt));
        } else {
            this.opt = Crypto.enc(this.genQuery(false, opt));
        }
    }

    genQuery(login, opt = {username: null}) {
        const param = {mode: 'clientside', app: 'beli_aja', version: 3};
        return {...param, ...opt};
    }

    get socket() {
        return this.socketApp;
    }

    init(url: string, params) {
        console.log('connecting =>', url);
        // console.log('connecting =>', params);
        this.socketApp = io.connect(url, {
            query: `param=${params}`,
        });
    }

    listener(
        onConnect = () => null,
        onDisconnect = () => null,
        onError = () => null,
    ) {
        const sockets = this.socketApp;
        if (sockets) {
            sockets.off('connect_error');
            sockets.off('connect');
            sockets.off('disconnect');
            sockets.on('connect', onConnect.bind(this, sockets));
            sockets.on('disconnect', onDisconnect.bind(this, sockets));
            sockets.on('connect_error', () => !onError.bind(this, sockets));
        }
    }

    unListener() {
        this.socketApp.off();
    }

    connect() {
        if (this.socketApp && this.socketApp.connected) {
            console.log('already connected ', this.url);
            this.listener(this.onConnect, this.onDisconnect, this.onError);
            return true;
        }
        this.init(this.url, this.opt);
        this.listener(this.onConnect, this.onDisconnect, this.onError);
    }

    emit(event, params) {
        let self = this;
        const id = Math.random();
        return new Promise((resolve, reject) => {
            startTimeout(id, reject);
            setTimeout(() => {
                if (self.socketApp) {
                    console.log('event', event, self.url);
                    self.socketApp.emit(event, params, resolve);
                } else {
                    resolve();
                }
            });
        })
            .then(async (arg) => {
                stopTimeout(id);
                return await new Promise((resolve, reject) => {
                    return resolve(arg);
                });
            })
            .catch((err) => {
                Alert.alert('', err.msg || err.message, [{text: 'OK'}]);
                return err;
            });
    }

    off(event) {
        let self = this;
        setTimeout(() => {
            self.socketApp.off(event);
        });
    }

    on(event, listener) {
        let self = this;
        setTimeout(() => {
            self.socketApp.on(event, listener);
        });
    }

    disconnect() {
        console.log('disconnect socket');
        let self = this;
        if (self.socketApp) {
            self.socketApp.disconnect();
            self.socketApp.off();
            self.socketApp = null;
        }
    }
}

export default Socket;
