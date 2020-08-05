/**
 * Created by tangzhibin on 16/8/4.
 */

'use strict';
import React, {Component} from 'react';
import {StyleSheet, View, Animated, Platform} from 'react-native';
import PropTypes from 'prop-types';

const DEFAULT_PLACEHOLDER_COLOR = '#C7C7CD';
const DEFAULT_LABEL_COLOR = '#E38F06';
const DEFAULT_LABEL_ERROR_COLOR = '#C5270E';

export default class TextInputLayout extends Component {
    static propTypes = {
        ...View.propTypes,
        hintColor: PropTypes.string,
        errorColor: PropTypes.string,
        focusColor: PropTypes.string,
        labelFontSize: PropTypes.number,
        labelText: PropTypes.string,
        checkValid: PropTypes.func
    };
    static defaultProps = {
        hintColor: DEFAULT_PLACEHOLDER_COLOR,
        errorColor: DEFAULT_LABEL_ERROR_COLOR,
        focusColor: DEFAULT_LABEL_COLOR,
        labelFontSize: 12,
        labelText: undefined,
        checkValid: undefined,
    };

    state = {
        showLabel: false,
        labelAnimationValue: new Animated.Value(0),
        isFocused: false,
        isError: false
    };

    constructor (props) {
        super(props);
        this._onBlur = this._onBlur.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onChangeText = this._onChangeText.bind(this);

        this._handleChildren(props);
    }

    UNSAFE_componentWillReceiveProps (nextProps) {
        this._handleChildren(nextProps);
    }

    UNSAFE_componentWillUpdate (nextProps, nextState) {
        if (nextState.showLabel !== this.state.showLabel) {
            this._springValue(this.state.labelAnimationValue, nextState.showLabel ? 1 : 0)
        }
    }

    _springValue (animatedValue, toValue) {
        Animated.spring(animatedValue, {
            toValue: toValue,
            friction: 10,
            useNativeDriver: false
        }).start();
    }

    /**
     * font, size, color, gravity, hintColor
     * @param props
     * @private
     */
    _handleChildren (props) {
        let edtChild = React.Children.only(props.children);
        this._oriEdtChild = edtChild;
        this._oriEdtStyle = StyleSheet.flatten([edtChild.props.style])
        this._oriOnFocus = edtChild.props.onFocus;
        this._oriOnBlur = edtChild.props.onBlur;
        this._oriOnChangeText = edtChild.props.onChangeText;

        const textValue = edtChild.props.value || edtChild.props.defaultValue;
        if (textValue) {
            this._edtText = textValue;
            this.state.showLabel = true;
            this.state.labelAnimationValue = new Animated.Value(1);
        }

        this._edtChild = React.cloneElement(edtChild, {
            onFocus: this._onFocus,
            onBlur: this._onBlur,
            onChangeText: this._onChangeText,
            style: [
                edtChild.props.style,
                {
                    backgroundColor: 'transparent',
                    textAlignVertical: 'center',
                    textAlign: 'left',
                    padding: 0,
                },
            ],
            placeholder: null,
            underlineColorAndroid: 'transparent',
        });

        let {height = 40, fontSize = 16} = this._oriEdtStyle;
        let labelHeight = fontSize + 3;

        let labelTransY = this.state.labelAnimationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [height + labelHeight >> 1, labelHeight - this.props.labelFontSize]
        });

        let labelFontSize = this.state.labelAnimationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [fontSize, this.props.labelFontSize]
        });
        this._labelStyle = {
            fontSize: labelFontSize,
            height: labelHeight,
            backgroundColor: 'transparent',
            transform: [{translateY: labelTransY}]
        };
    }

    _reload() {
        setTimeout(() => {
            this._springValue(
                this.state.labelAnimationValue,
                this._edtText ? 1 : 0,
            );
        });
    }

    _onFocus () {
        if (!this._edtText) this.setState({showLabel: true, isFocused: true});
        else this.setState({isFocused: true});
        this._oriOnFocus && this._oriOnFocus();
    }

    _onBlur () {
        let isError = false;
        if (this.props.checkValid) isError = !this.props.checkValid(this._edtText);
        if (!this._edtText) this.setState({showLabel: false, isFocused: false, isError});
        else this.setState({isFocused: false, isError});
        this._oriOnBlur && this._oriOnBlur();
    }

    _onChangeText (text) {
        this._edtText = text;
        if (this.props.checkValid) {
            let isError = !this.props.checkValid(this._edtText);
            if (this.state.isError !== isError) this.setState({isError});
        }
        this._oriOnChangeText && this._oriOnChangeText(text);
    }

    render () {
        let {isFocused, isError}=this.state;
        let {errorColor, hintColor, focusColor}=this.props;
        let color = isError ? errorColor : (isFocused ? focusColor : hintColor);
        return (
            <View
                style={[
                    {
                        borderBottomWidth: isFocused ? 2 : 1,
                        borderBottomColor: color,
                    },
                    this.props.style,
                ]}>
                <Animated.Text
                    style={[this._labelStyle, {color: color}]} >
                    {this.props.labelText || this._oriEdtChild.props.placeholder }
                </Animated.Text>
                {this._edtChild}
            </View>
        );
    }
}
