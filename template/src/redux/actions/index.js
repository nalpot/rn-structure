import Socket from '@app/network/socket';

const socket = new Socket(
    () => {
        console.log('socket connected');
    },
    () => {
        console.log('socket disconnect');
    },
    (s, err) => {
        console.log('socket error', err);
    },
);

export function initSocket() {
    return (_dispatch) => {
        socket.setUrl('your url');
        socket.setOptions(false);
        socket.connect();
        return socket;
    };
}

/**
 * params = {username: 'user', password: 123456}
 *
 * @param params
 * @returns {function(*): *}
 */
export function login(params) {
    return (dispatch) => {
        return socket
            .emit('your event', params)
            .then((response) => {
                console.log(response);
                return response;
            })
            .catch(console.log);
    };
}
