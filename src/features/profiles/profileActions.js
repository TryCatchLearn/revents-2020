import { LISTEN_TO_CURRENT_USER_PROFILE, LISTEN_TO_SELECTED_USER_PROFILE, LISTEN_TO_USER_PHOTOS, LISTEN_TO_USER_EVENTS } from './profileConstants';

export function listenToCurrentUserProfile(profile) {
    return {
        type: LISTEN_TO_CURRENT_USER_PROFILE,
        payload: profile
    }   
}

export function listenToSelectedUserProfile(profile) {
    return {
        type: LISTEN_TO_SELECTED_USER_PROFILE,
        payload: profile
    }   
}

export function listenToUserPhotos(photos) {
    return {
        type: LISTEN_TO_USER_PHOTOS,
        payload: photos
    }
}

export function listenToUserEvents(events) {
    return {
        type: LISTEN_TO_USER_EVENTS,
        payload: events
    }
}