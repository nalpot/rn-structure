/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {AppContextProvider} from '@app/libs';
import {persistor, store} from '@app/redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import InitScreen from '@app/navigation';
import {enableScreens} from 'react-native-screens';

enableScreens();

const App: () => React$Node = () => {
    return (
        <>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AppContextProvider>
                        <InitScreen />
                    </AppContextProvider>
                </PersistGate>
            </Provider>
        </>
    );
};

export default App;
