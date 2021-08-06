const reducers = function (state, action) {
    return {
        ...state,
        ...action.payload,
    };
};

export default reducers;
