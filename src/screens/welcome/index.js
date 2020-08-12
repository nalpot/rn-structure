import React, {useEffect} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import Text from '@app/libs/Text';
import {setLoadingSplash} from '@app/redux/reducers/Splash';

const SplashScreen: () => React$Node = React.forwardRef((props, ref) => {
    useEffect(() => {
        setTimeout(props.setLoading.bind(this, false), 2000);
    }, []);

    return (
        <View>
            <Text>Hello World</Text>
        </View>
    );
});

const mapStateToProps = (state, props) => {
    return {};
};

const mapDispatchToProps = {
    setLoading: (b) => (dispatch) => setLoadingSplash(b),
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
