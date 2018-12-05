const APIkey = (state = '', action) => {
    switch (action.type) {
        case `SET_API_KEY`:
            return action.payload;
        default:
            return state;
    }
}

export default APIkey;