const _ = require('lodash');

import { ADD_CONTACT } from '../actions/addContact';
import { REMOVE_CONTACT } from '../actions/removeContact';
import { SET_CONTACT_PRIORITY } from '../actions/setContactPriority';
import { UPDATE_CONTACT } from '../actions/updateContact';
import * as notifications from '../actions/PingNotifications'

const initialState = {
    contacts: []
};

export default function contacts(contactsState = initialState, action) {
    switch (action.type) {
        case ADD_CONTACT: {
            const newState = _.cloneDeep(contactsState);
            const { payload } = action;

            if (payload.contact) {
                const found = newState.contacts.find(c => c.contactId === payload.contact.contactId)
                if (!found) {
                    newState.contacts.push(payload.contact);
                    notifications.add(payload.contact);
                }
            }

            return newState;
        }

        case SET_CONTACT_PRIORITY: {
            const newState = _.cloneDeep(contactsState);
            const { payload } = action;
            const { contact, priority } = payload

            for (let i = 0; i < newState.contacts.length; i++) {
                if (newState.contacts[i].contactId === contact.contactId) {
                    newState.contacts[i].setPriority(priority);
                    break
                }
            }

            return newState;
        }

        case REMOVE_CONTACT: {
            const newState = _.cloneDeep(contactsState);
            const { payload } = action;

            const results = newState.contacts.filter(c => c.contactId !== payload.contact.contactId)
            let finalState = { contacts: results };

            notifications.remove(payload.contact)

            console.log("Removed Contact: ", payload.contact)

            return finalState;
        }

        case UPDATE_CONTACT: {
            const newState = _.cloneDeep(contactsState);
            const { payload } = action;
            const { contact } = payload;

            for (let i = 0; i < newState.contacts.length; i++) {
                let oldContact = newState.contacts[i];
                if (contact.contactId === oldContact.contactId) {
                    newState.contacts[i] = contact;
                    notifications.update(newState.contacts[i]);
                    console.log("Contact Updated: ", contact)
                    break
                }
            }
            return newState;
        }

        default:
            return contactsState;
    }
}
