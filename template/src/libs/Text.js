import React, {useImperativeHandle, useRef, useState} from 'react';
import {Text as TextF} from 'react-native';
import {bool} from 'prop-types';
import {useTheme} from '@react-navigation/native';

const fontFamiy = {
    bold: null,
    regular: null,
    light: null,
};

const Text: () => React$Node = React.forwardRef((props, ref) => {
    const combine = useRef(null);
    const [text, setTexts] = useState('');

    useImperativeHandle(ref, () => ({
        setText: (str) => setTexts(str),
        getText: () => text || props.children,
    }));

    const fontFamily = () => {
        if (props.bold) {
            return fontFamiy.bold;
        } else if (props.light) {
            return fontFamiy.light;
        } else {
            return fontFamiy.regular;
        }
    };

    const {colors} = useTheme();

    return (
        <TextF
            {...props}
            ref={combine}
            style={[
                {
                    color: colors.text,
                    fontFamily: fontFamily(),
                },
                props.style,
            ]}>
            {text || props.children}
        </TextF>
    );
});

Text.propTypes = {
    bold: bool,
    light: bool,
    style: TextF.propTypes.style,
};
Text.defaultProps = {
    bold: false,
    light: false,
};

export default Text;
