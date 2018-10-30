
const parksInState = (state=[], action) => {
    switch (action.type) {
        case 'SET_PARKS':
            return action.payload;
        case `CLEAR_PARKS`:
            return [];
        default:
            return state;
    }
}

export default parksInState;