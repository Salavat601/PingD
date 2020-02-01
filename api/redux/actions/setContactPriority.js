export const SET_CONTACT_PRIORITY = 'SET_CONTACT_PRIORITY';

export default function setContactPriority(contact, priority) {
    return {
        type: SET_CONTACT_PRIORITY,
        payload: {
            contact: contact,
            priority: priority,
        },
    };
}
