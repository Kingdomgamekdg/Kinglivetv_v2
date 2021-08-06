const initialState = {
  uploadStatus: {
    label: null,
    currentImage: null,
    image: null,
    imagePos: null,
  },
};

const reducers = (state = initialState, action) => ({ ...state, ...action.payload });

export default reducers;
