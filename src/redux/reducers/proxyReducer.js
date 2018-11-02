const proxyReducer = (state=0,action) => {
    switch (action.type) {
        case 'SWITCH_PROXY':
            return (state+1)%3;
        default:
            return state;
    }
}

export default proxyReducer;