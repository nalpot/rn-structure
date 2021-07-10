import React, {
    forwardRef,
    useCallback, useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Input as InputF, Icon} from 'react-native-elements';
import TextInputLayout from './TextInputLayout';
import * as PropTypes from 'prop-types';
import {useTheme} from '@react-navigation/native';
import Validate from 'validate.js';

const fontFamiy = {
    bold: null,
    regular: null,
    light: null,
};

const InputMD: () => React$Node = forwardRef((props, ref) => {
    const inputRef = useRef();
    const layoutRef = useRef();
    const {colors} = useTheme();
    const color = {
        ...colors,
        error: 'red',
        notice: 'orange',
        holder: 'rgba(125,125,125,0.8)',
    };

    // ============ init ============ //
    let rightIconContainerStyle = props.rightIconContainerStyle;
    let leftIconContainerStyle = props.leftIconContainerStyle;
    let onSubmitEditing = props.onSubmitEditing;
    let returnKeyType = props.returnKeyType;
    let containerStyle = props.containerStyle;
    let inputContainerStyle = props.inputContainerStyle;
    let inputStyle = props.inputStyle;
    let autoCapitalize = props.autoCapitalize;
    let alwaysShowNotice = props.alwaysShowNotice;
    let notice = props.notice;
    const validates = props.validate;
    const label = props.label || props.placeholder;
    const placeholder = props.placeholder;
    const placeholderTextColor = props.placeholderTextColor;
    const mode = props.mode;
    const keyboardType = props.keyboardType;
    const labeled = props.labeled;
    const editable = props.editable;
    const labelStyle = props.labelStyle;
    const autoFocus = props.autoFocus;

    // ============ state ============ //
    const [text, setText] = useState(props.defaultValue || '');
    const [withEye, setWithEye] = useState(props.withEye);
    const [eye, setEye] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(props.hidden);
    const [isError, setError] = useState('');
    const [errMsg, setErrorMsg] = useState(props.errMessage || '');

    // ============ function ============ //
    useEffect(() => {
        setText(props.defaultValue);
    }, [props.defaultValue]);

    const clear = useCallback(() => {
        setText('');
        inputRef.current.input.clear();
        if (layoutRef.current) {
            layoutRef.current._onChangeText('');
            !focused && layoutRef.current._onBlur();
        } else {
            addChangeText('');
        }
    }, [addChangeText, focused]);

    const changeEye = useCallback(() => {
        setEye(!eye);
    }, [eye]);

    const addChangeText = useCallback(
        str => {
            setText(str || '');
            let response = check(str, validates, label);
            setError(!response.success);
            setErrorMsg(response.message || '');
            props.onChangeText && props.onChangeText(str);
            return response.success;
        },
        [validates, label],
    );

    const onBlur = useCallback(() => {
        setFocused(false);
    }, []);

    const onFocus = useCallback(() => {
        setFocused(true);
    }, []);

    const nextFocus = useCallback(() => {
        props.next().focus();
    }, [props]);

    useImperativeHandle(ref, () => ({
        getText: () => text,
        setText: str => {
            setText(str);
            layoutRef.current && layoutRef.current._reload();
        },
        addError: str => {
            setError(!!str);
            setErrorMsg(str);
        },
        hide: () => {
            clear();
            setHidden(true);
        },
        show: () => {
            setHidden(false);
        },
        focus: () => {
            inputRef.current.focus();
        },
        shake: () => inputRef.current.shake(),
        isValid: () => {
            let response = check(text, validates, label);
            setError(!response.success);
            setErrorMsg(response.message || '');
            layoutRef.current && layoutRef.current._onChangeText(text);
            if (!response.success) {
                inputRef.current.shake();
                (props.editable && !props.disabled) && inputRef.current.focus();
            }
            return response.success;
        },
        clear,
    }));

    if (hidden) {
        return <View />;
    }

    const fontFamily = () => {
        if (props.bold) {
            return fontFamiy.bold;
        } else if (props.light) {
            return fontFamiy.light;
        } else {
            return fontFamiy.regular;
        }
    };

    let enabled =
        text && text.length > 0 && (props.editable && !props.disabled);

    let onNext = props.next ? nextFocus.bind(this) : null;
    let returnType = props.next ? 'next' : 'done';

    const defaultMode = mode === 'default';

    let ste = {};
    if (!defaultMode || (!errMsg || notice)) {
        ste = styles.disabledError;
        if (notice && !errMsg && alwaysShowNotice) {
            ste = {...styles.noticeStyle, ...props.noticeStyle};
        } else if (notice && !text && !isError) {
            ste = {...styles.noticeStyle, ...props.noticeStyle};
        } else if (isError) {
            ste = {};
        }
    }

    let InputComponent = (
        <InputF
            ref={inputRef}
            autoFocus={autoFocus}
            keyboardType={keyboardType}
            label={defaultMode && props.label}
            labelStyle={defaultMode && [{marginTop: 5, display: labeled?'flex':'none'}, labelStyle]}
            autoCapitalize={autoCapitalize}
            placeholder={placeholder}
            placeholderTextColor={
                defaultMode && (placeholderTextColor || color.holder)
            }
            editable={editable}
            defaultValue={text}
            onBlur={onBlur.bind(this)}
            onFocus={onFocus.bind(this)}
            clearButtonMode={'never'}
            onChangeText={defaultMode && addChangeText}
            errorStyle={!defaultMode ? styles.disabledError : ste}
            errorMessage={
                (defaultMode && (errMsg || notice)) ||
                (alwaysShowNotice || (!text && notice))
                    ? errMsg || notice
                    : null
            }
            inputStyle={[
                {color: color.text, fontFamily: fontFamily()},
                inputStyle,
            ]}
            inputContainerStyle={[
                !defaultMode && styles.inputContainerStyle,
                inputContainerStyle,
            ]}
            containerStyle={[styles.containerStyle, containerStyle]}
            secureTextEntry={withEye && !eye}
            blurOnSubmit={!(returnKeyType || props.next)}
            returnKeyType={returnKeyType || returnType}
            onSubmitEditing={onSubmitEditing || onNext}
            leftIcon={props.leftIcon}
            leftIconContainerStyle={leftIconContainerStyle}
            rightIconContainerStyle={[
                styles.rightIconContainerStyle,
                rightIconContainerStyle,
            ]}
            rightIcon={
                <View style={{flexDirection: 'row'}}>
                    {enabled ? (
                        <TouchableOpacity
                            style={styles.containerClearButton}
                            onPress={clear.bind(this)}>
                            <Icon
                                name={'ios-close-circle-outline'}
                                type={'ionicon'}
                                color={'gray'}
                            />
                        </TouchableOpacity>
                    ) : null}
                    {!withEye ? (
                        props.rightIcon
                    ) : (
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={changeEye.bind(this)}>
                            <Icon
                                name={!eye ? 'ios-eye-off' : 'ios-eye'}
                                type={'ionicon'}
                                color={'gray'}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            }
        />
    );

    if (defaultMode) {
        return <>{InputComponent}</>;
    } else {
        return (
            <>
                <TextInputLayout
                    ref={layoutRef}
                    errorColor={color.error}
                    checkValid={addChangeText.bind(this)}>
                    {InputComponent}
                </TextInputLayout>

                {isError || (alwaysShowNotice || (!text && notice)) ? (
                    <Text
                        style={[
                            styles.errorStyle,
                            {
                                color: color.error,
                                fontFamily: fontFamily(),
                            },
                            !isError && {
                                ...styles.noticeStyle,
                                ...props.noticeStyle,
                            },
                        ]}>
                        {errMsg || notice}
                    </Text>
                ) : null}
            </>
        );
    }
});

const constraints = {
    username: {
        presence: false,
        format: {
            pattern: '[a-z0-9]+',
            flags: 'i',
            message: 'can only contain a-z and 0-9',
        },
        length: {
            minimum: 6,
            message: function(
                value,
                attribute,
                validatorOptions,
                attributes,
                globalOptions,
            ) {
                return Validate.format('must be at least %{num} characters', {
                    num: validatorOptions.minimum,
                });
            },
        },
    },
    password: {
        presence: false,
        length: {
            minimum: 6,
            message: function(
                value,
                attribute,
                validatorOptions,
                attributes,
                globalOptions,
            ) {
                return Validate.format('must be at least %{num} characters', {
                    num: validatorOptions.minimum,
                });
            },
        },
    },
};

const constraintsEmail = {
    presence: true,
    format: {
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Invalid Email',
    },
};

const generateConstraints = (name, options) => {
    let obj = {};
    name = name || '';
    obj[name.toLowerCase()] = {
        presence: true,
        ...options,
    };
    return obj;
};

const check = (str, options, placeholder) => {
    let message = '';
    let response = {};
    let obj = {};
    placeholder = placeholder || '';
    switch (options.type) {
        case 'username':
            message = Validate(
                {username: str},
                {
                    ...constraints,
                    username: {
                        ...constraints.username,
                        ...options.option,
                        length: {
                            ...constraints.username.length,
                            ...(options.option && options.option.length),
                        },
                    },
                },
            );
            response = {
                success: !message,
                message: message && message.username[0],
            };
            break;
        case 'password':
            message = Validate(
                {password: str},
                {
                    ...constraints,
                    password: {
                        ...constraints.password,
                        ...options.option,
                        length: {
                            ...constraints.password.length,
                            ...(options.option && options.option.length),
                        },
                    },
                },
            );
            response = {
                success: !message,
                message: message && message.password[0],
            };
            break;
        case 'email':
            message = Validate.single(str, constraintsEmail);
            response = {success: !message, message: message && message[0]};
            break;
        case 'number':
            str && (obj[placeholder.toLowerCase()] = str);
            message = Validate(
                obj,
                generateConstraints(placeholder, {
                    ...(options.option || {}),
                    format: {
                        pattern: '[0-9.]+',
                        flags: 'i',
                        message: 'can only contain 0-9',
                        ...(options.option && options.option.format),
                    },
                }),
                {
                    format: 'flat',
                },
            );
            response = {success: !message, message: message && message[0]};
            break;
        case 'no-empty':
        case 'no-space':
            str && (obj[placeholder.toLowerCase()] = str);
            message = Validate(
                obj,
                generateConstraints(placeholder, {
                    ...(options.option || {}),
                    format: {
                        pattern: '[a-z0-9]+',
                        flags: 'i',
                        message: 'can only contain a-z and 0-9',
                        ...(options.option && options.option.format),
                    },
                }),
                {
                    format: 'flat',
                },
            );
            response = {success: !message, message: message && message[0]};
            break;
        case 'can-empty':
        default:
            response = {success: true};
            break;
    }
    return response;
};

const styles = StyleSheet.create({
    eyeButton: {
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerClearButton: {
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorStyle: {
        fontSize: 11,
        marginTop: 5,
        marginHorizontal: 3,
    },
    disabledError: {
        display: 'none',
    },
    customError: {
        borderColor: 'red',
        borderWidth: 1,
        borderBottomWidth: 1,
    },
    noticeStyle: {
        color: 'orange',
        marginTop: 5,
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
    },
    containerStyle: {
        backgroundColor: 'transparent',
    },
    rightIconContainerStyle: {
        marginLeft: 0,
    },
});

InputMD.propTypes = {
    validate: PropTypes.shape({
        type: PropTypes.oneOf([
            'number',
            'email',
            'username',
            'password',
            'no-space',
            'no-empty',
            'can-empty',
        ]),
        option: PropTypes.object,
    }),
    keyboardType: PropTypes.oneOf([
        'default',
        'ascii-capable',
        'decimal-pad',
        'email-address',
        'name-phone-pad',
        'number-pad',
        'numbers-and-punctuation',
        'numeric',
        'phone-pad',
        'twitter',
        'url',
        'visible-password',
        'web-search',
    ]),
    autoCapitalize: PropTypes.oneOf([
        'none',
        'characters',
        'sentences',
        'words',
    ]),
    returnKeyType: PropTypes.oneOf([
        //cross platform
        'search',
        'done',
        'go',
        'next',
        'send',
        //android
        'none',
        'previous',
        //ios
        'emergency-call',
        'google',
        'yahoo',
        'join',
        'route',
    ]),
    defaultValue: PropTypes.string,
    next: PropTypes.func,
    withEye: PropTypes.bool,
    editable: PropTypes.bool,
    hidden: PropTypes.bool,
    errMessage: PropTypes.string,
    notice: PropTypes.string,
    alwaysShowNotice: PropTypes.bool,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    labeled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    mode: PropTypes.oneOf(['default', 'material']),
};

InputMD.defaultProps = {
    validate: {type: 'can-empty'},
    autoCapitalize: 'none',
    defaultValue: '',
    keyboardType: 'default',
    hidden: false,
    withEye: false,
    placeholder: '',
    label: '',
    alwaysShowNotice: false,
    editable: true,
    next: null,
    labeled: true,
    autoFocus: false,
    mode: 'default',
};

export default InputMD;
