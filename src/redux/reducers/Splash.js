const initialState = {
    loading: true,
};

/**
 * todo fix me
 * make sure you have different constant per reducer
 */
const SET_LOADING = 'SET_LOADING_Splash'; //state before retrieve data

/**
 * ============================= Redux Actions =========================
 */

export const setLoadingSplash = (bool) => {
    //return a action type and a loading state indicating it is getting data.
    return {
        type: SET_LOADING,
        payload: bool,
    };
};

/**
 * ============================= Redux Reducer =========================
 */

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {...state, loading: action.payload};
        default:
            return state;
    }
};

export default reducer;
