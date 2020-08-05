import React from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import Text from '@app/libs/Text';

const SplashScreen: () => React$Node = React.forwardRef((props, ref) => {
    return (
        <View>
            <Text>Hello World</Text>
        </View>
    );
});

const mapStateToProps = (state, props) => {
    return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
