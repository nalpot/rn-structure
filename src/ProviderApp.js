import React, {
    useState,
    useEffect,
    useContext,
    useImperativeHandle,
} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import Modal from 'react-native-modal';
import * as PropTypes from 'prop-types';
const Lang = {id: {}, en: {}};
import {Dimensions, Platform, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native';
import DialogProvider from './dialog/DialogProvider';

//================== LANGUAGE SETTING ==================//
const STORAGE_KEY = 'LANG_ID';
const LangContext = React.createContext();

const AppContextProvider = ({children}) => {
    const [langID, setLangID] = useState('id');
    const [dim, setDimension] = useState(Dimensions.get('screen'));
    const [realm, setRealm] = useState(null);
    const changeDimensions = React.useCallback(() => {
        setDimension(Dimensions.get('screen'));
    }, []);

    useEffect(() => {
        (async () => {
            const storedThemeID = 'id';
            setLangID(storedThemeID);
            console.log('set Language');
        })();
        Dimensions.addEventListener('change', changeDimensions);
        return () => {
            Dimensions.removeEventListener('change', changeDimensions);
        };
    }, [changeDimensions]);

    StatusBar.setBarStyle('light-content');

    return (
        <LangContext.Provider value={{langID, setLangID, dim, setDimension, realm, setRealm}}>
            <DialogProvider>{langID ? children : null}</DialogProvider>
        </LangContext.Provider>
    );
};

function withLanguage(Component) {
    return React.forwardRef((props, ref) => {
        const {langID, setLangID} = useContext(LangContext);

        const getLang = (lang) => Lang[lang];
        const setLang = (lang) => {
            setLangID(lang);
        };

        return (
            <Component
                {...props}
                ref={ref}
                lang={getLang(langID)}
                setLang={setLang}
            />
        );
    });
}
//================== END LANGUAGE SETTING ==================//

function withDimensions(Component) {
    return React.forwardRef((props, ref) => {
        const {dim, setDimension} = useContext(LangContext);

        return (
            <Component
                {...props}
                ref={ref}
                dimens={dim}
                setDimension={setDimension}
            />
        );
    });
}

const {width, height} = Dimensions.get('screen');

const aspectRatio = (imgWidth, imgHeight, targetWidth = width) => {
    const aspectRas = imgWidth / imgHeight;
    const newHeight = targetWidth / aspectRas;
    return {width: targetWidth, height: newHeight};
};

function withFocused(Component) {
    return React.forwardRef((props, ref) => {
        const isFocused = useIsFocused();
        return <Component {...props} ref={ref} focused={isFocused} />;
    });
}

function asModalized(Component) {
    return React.forwardRef((props, ref) => {
        const modalRef = React.useRef(null);
        const [data, setData] = React.useState(null);
        const [isShow, setShow] = React.useState(false);

        useImperativeHandle(ref, () => ({
            open: () => {
                setShow(true);
                modalRef.current.open();
            },
            openWithData: (d) => {
                setData(d);
                setShow(true);
                modalRef.current.open();
            },
        }));

        const onBackButtonPress = React.useCallback(() => {
            modalRef.current && modalRef.current.close();
        }, []);

        return (
            <Modalize
                {...props.modalProps}
                ref={modalRef}
                onBackButtonPress={onBackButtonPress.bind(this)}
                modalHeight={props.modalHeight || 500}
                snapPoint={props.snap || 300}
                handlePosition="inside"
                openAnimationConfig={{
                    timing: {duration: 400},
                    spring: {speed: 20, bounciness: 10},
                }}
                closeAnimationConfig={{
                    timing: {duration: 400},
                    spring: {speed: 20, bounciness: 10},
                }}>
                <Component
                    {...props}
                    modal={modalRef.current}
                    modalData={data}
                />
            </Modalize>
        );
    });
}

asModalized.propTypes = {
    modalProps: PropTypes.shape({
        ...Modalize.defaultProps,
    }),
    modalHeight: PropTypes.number,
    snap: PropTypes.number,
};

function asDialog(Component) {
    return React.forwardRef((props, ref) => {
        const [visible, setVisible] = React.useState(false);
        const [data, setData] = React.useState(null);

        const open = React.useCallback(() => {
            setVisible(true);
        }, []);

        const openWithData = React.useCallback((d) => {
            setData(d);
            setVisible(true);
        }, []);

        const close = React.useCallback(() => {
            setVisible(false);
        }, []);

        useImperativeHandle(ref, () => ({
            open,
            close,
            openWithData,
        }));

        return (
            <Modal
                {...props.modal}
                isVisible={visible}
                useNativeDriver={true}
                backdropOpacity={0.8}
                onRequestClose={close}
                onBackdropPress={close}>
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

function withSafeArea(Component) {
    return React.forwardRef((props, ref) => {
        return (
            <SafeAreaView mode={'padding'} style={{flex: 1}}>
                <Component {...props} />
            </SafeAreaView>
        );
    });
}

function withRealm(Component) {
    return React.forwardRef((props, ref) => {
        const {realm, setRealm} = useContext(LangContext);

        return <Component {...props} realm={realm} />;
    });
}

export {
    asDialog,
    asModalized,
    withFocused,
    withSafeArea,
    withLanguage,
    withDimensions,
    withRealm,
    aspectRatio,
};

export default AppContextProvider;
