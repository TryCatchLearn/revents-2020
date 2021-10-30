import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { asyncActionStart, asyncActionError, asyncActionFinish } from '../async/asyncReducer';
import { dataFromSnapshot } from '../firestore/firestoreService';
import { onSnapshot } from '@firebase/firestore';

export default function useFirestoreDoc({query, data, deps, shouldExecute = true}) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!shouldExecute) return;
        dispatch(asyncActionStart());
        const unsubscribe = onSnapshot(query(),
            snapshot => {
                if (!snapshot.exists) {
                    dispatch(asyncActionError({code: 'not-found', message: 'Could not find document'}));
                    return;
                }
                data(dataFromSnapshot(snapshot));
                dispatch(asyncActionFinish());
            },
            error => dispatch(asyncActionError())
        );
        return () => {
            unsubscribe()
        }
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}