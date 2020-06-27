import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';
import { verifyAuth } from '../../features/auth/authActions';

export function configureStore() {
    const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

    store.dispatch(verifyAuth());

    return store;
}