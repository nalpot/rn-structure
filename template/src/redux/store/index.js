import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {createRealmPersistStorage} from './storage';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

// Middleware: Redux Persist Config
const persistConfig = {
    // Root
    key: 'root',
    // Storage Method (React Native)
    storage: createRealmPersistStorage(),
    // Whitelist (Save Specific Reducers)
    whitelist: ['user'],
    // Blacklist (Don't Save Specific Reducers)
    blacklist: ['splash'],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
// Redux: Store
const store = createStore(persistedReducer, applyMiddleware(thunk));
// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// Exports
export {store, persistor};
