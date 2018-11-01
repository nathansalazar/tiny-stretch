const proxyReducer = (state='https://cors-anywhere.herokuapp.com/',action) => {
    switch (action.type) {
        case 'SWITCH_PROXY':
            return 'https://cors.io/?';
        default:
            return state;
    }
}

export default proxyReducer;