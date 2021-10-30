import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { asyncActionStart, asyncActionError, asyncActionFinish } from '../async/asyncReducer';
import { dataFromSnapshot } from '../firestore/firestoreService';
import { onSnapshot } from '@firebase/firestore';

export default function useFirestoreCollection({query, data, deps}) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(asyncActionStart());
        const unsubscribe = onSnapshot(query(),
            snapshot => {
                const docs = snapshot.docs.map(doc => dataFromSnapshot(doc));
                data(docs);
                dispatch(asyncActionFinish());
            },
            error => dispatch(asyncActionError(error))
        );
        return () => {
            unsubscribe()
        }
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}