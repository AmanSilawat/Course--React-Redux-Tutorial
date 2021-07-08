const redux = require('redux');
const createStore = redux.createStore;

const BUY_CAKE = 'BUY_CAKE';
const BUY_ICECREAM = 'BUY_ICECREAM';

// action creator for cake
function buyCake() {
    return {
        type: BUY_CAKE,
        info: 'First redux action'
    }
}

// action creator for iceCream
function buyIceCream() {
    return {
        type: BUY_ICECREAM,
    }
}

// state
const initialCakeState = {
    numOfCakes: 10
}

const initialIceCreamState = {
    numOfCakes: 20
}

const cakeReducer = (state = initialCakeState, action) => {
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

const iceCreamReducer = (state = initialIceCreamState, action) => {
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

const store = createStore(reducer);
console.log('initial state', store.getState());

const unsubscribe = store.subscribe(() => console.log('updated state', store.getState()))

store.dispatch(buyCake());
store.dispatch(buyCake());
store.dispatch(buyCake());

store.dispatch(buyIceCream());
store.dispatch(buyIceCream());

unsubscribe();