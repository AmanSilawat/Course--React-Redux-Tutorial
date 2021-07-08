import { BUY_CAKE } from './cakeTypes';

const initialSate = {
    numOfCakes: 10
}

const reducer = (state = initialSate, action) => {
    switch (action.type) {
        case BUY_CAKE:
            return {
                ...state,
                numOfCakes: state.numOfCakes - 1
            }
    
        default:
            return state;
    }
}

export default reducer;