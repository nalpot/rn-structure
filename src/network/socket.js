import io from 'socket.io-client';
import {Alert} from '@app/libs/dialog/DialogProvider';
//todo fix this
const url = `your url`;
const interval = 30000;
export let socketApp;

export function checkSocket() {
    return new Promise((resolve, reject) => {
        if (!socketApp || !socketApp.connected) {
            socketApp = io.connect(url, {
                timeout: 10000,
                jsonp: false,
                forceNew: true,
                transports: ['polling', 'websocket'],
                autoConnect: true,
            });
            socketApp.connect();
            resolve();
        } else {
            resolve();
        }
    });
}

export async function emit(
    socket,
    event,
    param,
    withTimeout = true,
    withcallback = true,
) {
    await checkSocket();

    if (!socket) {
        socket = socketApp;
    }

    console.log(event, param);
    if (!withcallback) {
        socket.emit(event, param);
    } else {
        const id = Math.random();
        return new Promise((resolve, reject) => {
            withTimeout && startTimeout(id, reject);
            socket.emit(event, param, resolve);
        })
            .then((res) => {
                withTimeout && stopTimeout(id);
                return res;
            })
            .catch((err) => {
                Alert.alert('', err.msg || err.message, [{text: 'OK'}]);
                return err;
            });
    }
}

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
    t && clearTimeout(t);
    timeout.delete(id);
}
