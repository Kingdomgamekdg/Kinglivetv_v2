const validate = {
    email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    password: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/,
};
export default validate;
