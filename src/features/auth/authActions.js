import { SIGN_IN_USER, SIGN_OUT_USER } from './authConstants';
import {APP_LOADED} from '../../app/async/asyncReducer';
import { getUserProfile, dataFromSnapshot } from '../../app/firestore/firestoreService';
import { listenToCurrentUserProfile } from '../profiles/profileActions';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import { app } from '../../app/config/firebase';
import { onSnapshot } from '@firebase/firestore';

const auth = getAuth(app);

export function signInUser(user) {
  return {
      type: SIGN_IN_USER,
      payload: user
  }
}

export function verifyAuth() {
    return function (dispatch) {
        return onAuthStateChanged(auth, user => {
            if (user) {
                dispatch(signInUser(user));
                const profileRef = getUserProfile(user.uid);
                onSnapshot(profileRef, snapshot => {
                  dispatch(listenToCurrentUserProfile(dataFromSnapshot(snapshot)));
                  dispatch({type: APP_LOADED})
                })
            } else {
                dispatch(signOutUser())
                dispatch({type: APP_LOADED})
            }
        })
    }
}

export function signOutUser() {
  return {
    type: SIGN_OUT_USER,
  };
}
