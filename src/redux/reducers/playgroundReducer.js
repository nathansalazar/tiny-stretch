
const playgrounds = (state=[], action) => {
    switch (action.type) {
        case 'SET_PLAYGROUNDS':
            return [...state, ...action.payload];
        case `CLEAR_PLAYGROUNDS`:
            return [];
        default:
            return state;
    }
}

export default playgrounds;