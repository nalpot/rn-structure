import 'react-native-gesture-handler/jestSetup';
jest.useFakeTimers();

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');

    // The mock for `call` immediately calls the callback which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};

    return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.mock('realm', () => {
    return require('../__mock__/realm').default;
});

jest.mock('react-native-svg-transformer', () => {
    return require('../__mock__/svgMock');
});

jest.mock('redux-persist/integration/react', () => ({
    PersistGate: props => props.children,
}));

jest.mock('react-native-screens', () => {
    const RealComponent = jest.requireActual('react-native-screens');
    const enableSmock = jest.spyOn(RealComponent, 'enableScreens');
    const data = true;
    RealComponent.enableScreens(data);
    expect(RealComponent.enableScreens).toHaveBeenCalledWith(data);
    expect(enableSmock).toHaveBeenCalledWith(data);

    return RealComponent;
});

// jest.mock('react-native-screens', () => {
//     const RealComponent = jest.requireActual('react-native-screens');
//     RealComponent.enableScreens = function () {};
//     return RealComponent;
// });
//
// jest.mock('react-native-simple-toast', () => ({
//     SHORT: jest.fn(),
// }));

// jest.mock('../src/component/Amount', () => {
//     const RealComponent = jest.requireActual('../src/component/Amount');
//     const React = require('React');
//     class Amount extends React.Component {
//         render() {
//             return React.createElement('Amounts', this.props, this.props.children);
//         }
//     }
//     Amount.propTypes = RealComponent.propTypes;
//     return Amount;
// });
