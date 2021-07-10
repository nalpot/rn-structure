import React, {PureComponent} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ButtonGroup, Card, normalize} from 'react-native-elements';
import {useTheme} from '@react-navigation/native';

const color = 'rgba(210,210,210,0.99)';
const DialogAlert: () => React$Node = React.forwardRef((props, ref) => {
    const title = props.modalData && props.modalData.title;
    const content = props.modalData && props.modalData.content;
    const buttons = props.modalData && props.modalData.buttons || [{text: 'OK', onPress: () => null}];
    const buttonNames = buttons.map((value) => value.text);
    const buttonPress = buttons.map((value) => value.onPress);
    return (
        <Card containerStyle={styles.container}>
            <View style={styles.containerContent}>
                {title ? <Text style={styles.title}>{title}</Text> : null}
                <Text style={styles.content}>{content}</Text>
            </View>
            <View style={styles.containerButton}>
                <ButtonGroup
                    containerStyle={styles.contentButton}
                    innerBorderStyle={styles.border}
                    containerBorderRadius={0}
                    buttonContainerStyle={styles.button}
                    textStyle={[
                        styles.textButton,
                        {color: useTheme().colors.primary},
                    ]}
                    buttonStyle={styles.btn}
                    buttons={buttonNames}
                    selectedIndex={-1}
                    onPress={(selectedIndex) => {
                        props.modal.close();
                        buttonPress[selectedIndex] && setTimeout(buttonPress[selectedIndex]);
                    }}
                />
            </View>
        </Card>
    );
});

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: color,
        marginHorizontal: 30,
    },
    containerContent: {paddingVertical: 15, paddingHorizontal: 10},
    title: {
        fontWeight: 'bold',
        marginBottom: normalize(5),
        fontSize: 18,
        textAlign: 'center',
    },
    content: {color: 'black', textAlign: 'center', paddingHorizontal: 10},
    containerButton: {
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    contentButton: {
        backgroundColor: color,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        borderWidth: 0,
        borderTopWidth: 1,
        borderColor: 'rgba(80,80,80,0.4)',
    },
    border: {color: 'rgba(80,80,80,0.4)'},
    button: {
        backgroundColor: color,
        borderWidth: 0,
        borderRadius: 0,
    },
    textButton: {color: 'blue'},
    btn: {margin: 0},
});

export default DialogAlert;
