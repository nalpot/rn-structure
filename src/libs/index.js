import Text from './Text';
import Input from './Input';
import SvgIcon from './SvgIcon';
import AppContextProvider, {
    asDialog,
    withRealm,
    withLanguage,
    withFocused,
    withDimensions,
    aspectRatio,
    asModalized,
    withSafeArea,
    AppContext,
} from './ProviderApp';

const Using = {
    AppContext,
    asDialog,
    withSafeArea,
    withDimensions,
    asModalized,
    aspectRatio,
    withFocused,
    withLanguage,
    withRealm,
};

export {Text, Input, SvgIcon, AppContextProvider, Using};
