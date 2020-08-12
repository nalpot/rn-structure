import {emit, socketApp} from './socket';

export async function login(params) {
  return emit(socketApp, 'your event', params);  
}
