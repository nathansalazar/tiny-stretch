const checkpoints = (state = [], action) => {
    switch (action.type) {
        case `SET_CHECKPOINTS`:
            return action.payload;
        case 'CLEAR_CHECKPOINTS':
            return [];
        default:
            return state;
    }
}

export default checkpoints;