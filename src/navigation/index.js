import React from 'react';
import {connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {Host} from 'react-native-portalize';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '@app/screens/welcome';

const Stack = createStackNavigator();

const InitApp: () => React$Node = React.forwardRef((props, ref) => {
    return (
        <NavigationContainer>
            <Host>
                <Stack.Navigator>
                    <Stack.Screen name={'Splash'} component={SplashScreen} />
                </Stack.Navigator>
            </Host>
        </NavigationContainer>
    );
});

const mapStateToProps = (state, props) => {
    return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InitApp);
