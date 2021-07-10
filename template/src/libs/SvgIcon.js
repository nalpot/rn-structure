import {string, number, oneOfType, oneOf, func} from 'prop-types';
import React from 'react';
import {TouchableOpacity, ViewPropTypes} from 'react-native';
import {Badge, normalize} from 'react-native-elements';
import * as Icon from '../assets/icons';
import {Icon as IconE} from 'react-native-elements';
import {useTheme} from '@react-navigation/native';

const _selectIcon = (name, width, height, color, props) => {
    if (Icon && Icon[name]) {
        return React.createElement(Icon[name], {
            ...props,
            width,
            height,
            fill: color,
        });
    } else {
        return <IconE {...props} color={color} />;
    }
};

const SvgIcon: () => React$Node = props => {
    const {colors} = useTheme();

    let sizeW = props.width;
    let sizeH = props.height;
    if (props.size !== undefined) {
        sizeW = parseInt(props.size.toString());
        sizeH = parseInt(props.size.toString());
    }
    if (!sizeW) {
        sizeW = normalize(25);
    }
    if (!sizeH) {
        sizeH = normalize(25);
    }

    return (
        <TouchableOpacity
            disabled={!props.onPress}
            onPress={props.onPress}
            style={[
                props.style,
                {
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
            ]}>
            {_selectIcon(
                props.name,
                sizeW,
                sizeH,
                props.color || colors.text,
                props,
            )}
            {props.badge && props.badge !== 0 ? (
                <Badge
                    status="error"
                    value={props.badge}
                    containerStyle={{position: 'absolute', top: -3, right: -7}}
                />
            ) : null}
        </TouchableOpacity>
    );
};

SvgIcon.propTypes = {
    width: number,
    height: number,
    name: string.isRequired,
    color: string,
    size: number,
    onPress: func,
    type: oneOf([
        'material',
        'material-community',
        'simple-line-icon',
        'zocial',
        'font-awesome',
        'octicon',
        'ionicon',
        'foundation',
        'evilicon',
        'entypo',
        'antdesign',
        'font-awesome-5',
    ]),
    style: ViewPropTypes.style,
    badge: oneOfType([number, string]),
};

SvgIcon.defaultProps = {
    width: 25,
    height: 25,
    color: null,
    size: 25,
    onPress: null,
    badge: null,
};

export default SvgIcon;
