export const REMOVE_CONTACT = 'REMOVE_CONTACT';

export default function removeContact(contact) {
    return {
        type: REMOVE_CONTACT,
        payload: {
            contact: contact,
        },
    };
}