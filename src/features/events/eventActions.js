import { CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT } from './eventConstants';

export function createEvent(event) {
    return {
        type: CREATE_EVENT,
        payload: event
    }
}

export function updateEvent(event) {
    return {
        type: UPDATE_EVENT,
        payload: event
    }
}

export function deleteEvent(eventId) {
    return {
        type: DELETE_EVENT,
        payload: eventId
    }
}