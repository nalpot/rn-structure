import React, {
    createContext,
    PureComponent,
    useImperativeHandle,
    useState,
} from 'react';
import DialogAlert from './DialogAlert';
import Modal from 'react-native-modal';
import {Alert as AlertF, Platform} from 'react-native';

function withDialog(Component) {
    return React.forwardRef((props, ref) => {
        const [data, setData] = React.useState(null);
        const [visible, setVisible] = React.useState(false);

        const open = React.useCallback(setVisible.bind(this, true), []);

        const openWithData = React.useCallback(d => {
            setVisible(true);
            setData(d);
        }, []);

        const close = React.useCallback(() => {
            setVisible(false);
        }, []);

        useImperativeHandle(ref, () => ({
            open,
            close,
            openWithData,
        }));

        const cancelable = data && data.options && data.options.cancelable;
        return (
            <Modal
                {...props.modal}
                isVisible={visible}
                useNativeDriver={true}
                backdropOpacity={0.8}
                onRequestClose={cancelable && close || null}
                onBackdropPress={cancelable && close || null}>
                <Component
                    {...props}
                    modal={ref.current}
                    isVisibleModal={visible}
                    modalData={data}
                />
            </Modal>
        );
    });
}

// =========================================//
// ============= setup component ===========//

let _alert = React.createRef();
class AlertDialog extends PureComponent {
    render() {
        const AlertD = withDialog(DialogAlert);
        return (
            <AlertD ref={_alert} modal={{backdropColor: 'rgba(0,0,0,0.5)', animationIn: 'fadeIn', animationOut: 'fadeOut', backdropTransitionOutTiming: 0, hideModalContentWhileAnimating: true}} />
        );
    }

    open = () => {
        this.close();
        setTimeout(_alert.current.open);
    };

    openWithData = (data) => {
        _alert.current.openWithData(data);
    };

    close = () => {
        _alert.current.close();
    };
}

// ========================================== //
// =============== setup function =========== //

export class Alert {
    static alert(
        title = '',
        content = '',
        buttons = [{text: '', onPress: () => null}],
        options = {cancelable: false, system: false},
    ) {
        if (options.system) {
            Platform.OS !== 'ios'
                ? _alert.current.openWithData({title, content, buttons, options})
                : AlertF.alert(title, content, buttons, options);
            return;
        }
        Platform.OS !== 'web'
            ? _alert.current.openWithData({title, content, buttons, options})
            : AlertF.alert(title, content, buttons, options);
    }
}

const DialogContext = createContext();

const DialogProvider = ({children}) => {
    const [dialog, setDialog] = useState(null);

    return (
        <DialogContext.Provider value={{dialog, setDialog}}>
            {children}
            <AlertDialog />
        </DialogContext.Provider>
    );
};

export default DialogProvider;
