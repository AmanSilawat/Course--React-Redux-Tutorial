import { BUY_ICECREAM } from './iceCreamType';

const initial_state = {
    numOfIceCream: 20
}

const reducer = (state = initial_state, action) => {
    switch (action.type) {
        case BUY_ICECREAM:
            return {
                ...state,
                numOfIceCream: state.numOfIceCream - 1
            }

        default:
            return state;
    }
}

export default reducer;