import {
  getFirestore,
  collection,
  Timestamp,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  arrayUnion,
  arrayRemove,
  updateDoc,
  query,
  orderBy,
  where,
  deleteDoc,
  serverTimestamp,
  increment,
  writeBatch,
  limit,
  startAfter
} from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import { app } from '../config/firebase';

const db = getFirestore(app);
const auth = getAuth(app);

export function dataFromSnapshot(snapshot) {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();

  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }

  return {
    ...data,
    id: snapshot.id,
  };
}

export function fetchEventsFromFirestore(
  filter,
  startDate,
  pageSize,
  lastDocSnapshot = null
) {
  const user = auth.currentUser;
  const q = query(collection(db, 'events'), orderBy('date'), startAfter(lastDocSnapshot), limit(pageSize));
  switch (filter) {
    case 'isGoing':
      return query(q,
        where('attendeeIds', 'array-contains', user.uid),
        where('date', '>=', startDate)
      )
    case 'isHost':
      return query(q,
        where('hostUid', '==', user.uid),
        where('date', '>=', startDate)
      )
    default:
      return query(q,
        where('date', '>=', startDate))
  }
}

export function listenToEventFromFirestore(eventId) {
  return doc(db, 'events', eventId);
}

export function addEventToFirestore(event) {
  const user = auth.currentUser;
  return addDoc(collection(db, 'events'), {
    ...event,
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: user.photoURL || null,
    attendees: arrayUnion({
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL || null
    }),
    attendeeIds: arrayUnion(user.uid)
  })
}

export function updateEventInFirestore(event) {
  const eventDoc = doc(db, 'events', event.id);
  return updateDoc(eventDoc, event);
}

export function deleteEventInFirestore(eventId) {
  return deleteDoc(doc(db, 'events', eventId));
}

export function cancelEventToggle(event) {
  const eventDoc = doc(db, 'events', event.id);
  return updateDoc(eventDoc, {
    isCancelled: !event.isCancelled
  })
}

export function setUserProfileData(user) {
  return setDoc(doc(db, 'users', user.uid), {
    displayName: user.displayName,
    email: user.email,
    createdAt: serverTimestamp()
  })
}

export function getUserProfile(userId) {
  return doc(db, 'users', userId);
}

export async function updateUserProfile(profile) {
  const user = auth.currentUser;
  try {
    if (user.displayName !== profile.displayName) {
      updateProfile(user, {
        displayName: profile.displayName
      })
    }
    return await updateDoc(doc(db, 'users', user.uid), profile)
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfilePhoto(downloadURL, filename) {
  const user = auth.currentUser;
  const userDocRef = doc(db, 'users', user.uid);
  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.data().photoURL) {
      await updateDoc(userDocRef, {
        photoURL: downloadURL
      });
      await updateProfile(user, {
        photoURL: downloadURL
      })
    }
    return await addDoc(collection(db, 'users', user.uid, 'photos'), {
      name: filename,
      url: downloadURL
    })
  } catch (error) {
    console.log('fserror', error)
    throw error;
  }
}

export function getUserPhotos(userUid) {
  return collection(db, 'users', userUid, 'photos');
}

export async function setMainPhoto(photo) {
  const user = auth.currentUser;
  const today = new Date();
  const eventDocQuery = query(collection(db, 'events'),
    where('attendeeIds', 'array-contains', user.uid),
    where('date', '>=', today));
  const userFollowingRef = collection(db, 'following', user.uid, 'userFollowing');
  const batch = writeBatch(db);

  batch.update(doc(db, 'users', user.uid), {
    photoURL: photo.url
  })

  try {
    const eventsQuerySnap = await getDocs(eventDocQuery);
    for (let i = 0; i < eventsQuerySnap.docs.length; i++) {
      let eventDoc = eventsQuerySnap.docs[i];
      if (eventDoc.data().hostUid === user.uid) {
        batch.update(eventsQuerySnap.docs[i].ref, {
          hostPhotoURL: photo.url
        })
      }
      batch.update(eventsQuerySnap.docs[i].ref, {
        attendees: eventDoc.data().attendees.filter(attendee => {
          if (attendee.id === user.uid) {
            attendee.photoURL = photo.url
          }
          return attendee;
        })
      })
    }
    const userFollowingSnap = await getDocs(userFollowingRef);
    userFollowingSnap.docs.forEach(docRef => {
      let followingDocRef = doc(db, 'following', docRef.id, 'userFollowers', user.uid);
      batch.update(followingDocRef, {
        photoURL: photo.url
      })
    })

    await batch.commit();

    return await updateProfile(user, {
      photoURL: photo.url
    })
  } catch (error) {
    throw error;
  }
}

export function deletePhotoFromCollection(photoId) {
  const userUid = auth.currentUser.uid;
  return deleteDoc(doc(db, 'users', userUid, 'photos', photoId));
}

export function addUserAttendance(event) {
  const user = auth.currentUser;
  return updateDoc(doc(db, 'events', event.id), {
    attendees: arrayUnion({
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL || null
    }),
    attendeeIds: arrayUnion(user.uid)
  })
}

export async function cancelUserAttendance(event) {
  const user = auth.currentUser;
  try {
    const eventDoc = await getDoc(doc(db, 'events', event.id));
    return updateDoc(doc(db, 'events', event.id), {
      attendees: eventDoc.data().attendees.filter(attendee => attendee.id !== user.uid),
      attendeeIds: arrayRemove(user.uid)
    })
  } catch (error) {
    throw error;
  }
}

export function getUserEventsQuery(activeTab, userUid) {
  let eventsRef = collection(db, 'events');
  const today = new Date();
  switch (activeTab) {
    case 1: // past events
      return query(eventsRef,
        where('attendeeIds', 'array-contains', userUid),
        where('date', '<=', today),
        orderBy('date', 'desc')
      )
    case 2: // hosted
      return query(eventsRef,
        where('hostUid', '==', userUid),
        orderBy('date')
      )
    default:
      return query(eventsRef,
        where('attendeeIds', 'array-contains', userUid),
        where('date', '>=', today),
        orderBy('date')
      )
  }
}

export async function followUser(profile) {
  const user = auth.currentUser;
  const batch = writeBatch(db);
  try {
    batch.set(doc(db, 'following', user.uid, 'userFollowing', profile.id), {
      displayName: profile.displayName,
      photoURL: profile.photoURL || '/assets/user.png',
      uid: profile.id
    });

    batch.update(doc(db, 'users', user.uid), {
      followingCount: increment(1)
    })
    return await batch.commit();
  } catch (e) {
    throw e
  }
}

export async function unfollowUser(profile) {
  const user = auth.currentUser;
  const batch = writeBatch(db);
  try {
    batch.delete(doc(db, 'following', user.uid, 'userFollowing', profile.id));
    batch.update(doc(db, 'users', user.uid), {
      followingCount: increment(-1)
    })
    return await batch.commit();
  } catch (e) {
    throw e;
  }
}

export function getFollowersCollection(profileId) {
  return collection(db, 'following', profileId, 'userFollowers');
}

export function getFollowingCollection(profileId) {
  return collection(db, 'following', profileId, 'userFollowing');
}

export function getFollowingDoc(profileId) {
  const userUid = auth.currentUser.uid;
  return getDoc(doc(db, 'following', userUid, 'userFollowing', profileId))
}
