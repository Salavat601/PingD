const _ = require('lodash');

import {ADD_CONTACT} from '../actions/addContact';
import {REMOVE_CONTACT} from '../actions/removeContact';
import {SET_CONTACT_PRIORITY} from '../actions/setContactPriority';
import {UPDATE_CONTACT} from '../actions/updateContact';
import * as NotificationManager from '../actions/notificationManager';
import { Contact } from '../../models/contactManager';

const initialState = {
  contacts: [],
};

export default function contacts(contactsState = initialState, action) {
  switch (action.type) {
    case ADD_CONTACT: {
      const newState = _.cloneDeep(contactsState);
      const {payload} = action;

      if (payload.contact) {
        const found = newState.contacts.find(
          c => c.contactId === payload.contact.contactId,
        );
        if (!found) {
          newState.contacts.push(payload.contact);
          NotificationManager.register(payload.contact);
        }
      }

      return newState;
    }

    case SET_CONTACT_PRIORITY: {
      const newState = _.cloneDeep(contactsState);
      const {payload} = action;
      const {contact, priority} = payload;

      for (let i = 0; i < newState.contacts.length; i++) {
        if (newState.contacts[i].contactId === contact.contactId) {
			Contact.setPriority(newState.contacts[i], priority);
          NotificationManager.update(newState.contacts[i]);
          break;
        }
      }

      return newState;
    }

    case REMOVE_CONTACT: {
      const newState = _.cloneDeep(contactsState);
      const {payload} = action;

      const results = newState.contacts.filter(
        c => c.contactId !== payload.contact.contactId,
      );
      let finalState = {contacts: results};

      NotificationManager.cancel(payload.contact);

      console.log('Removed Contact: ', payload.contact);

      return finalState;
    }

    case UPDATE_CONTACT: {
      const newState = _.cloneDeep(contactsState);
      const {payload} = action;
      const {contact} = payload;

      for (let i = 0; i < newState.contacts.length; i++) {
        let oldContact = newState.contacts[i];
        if (contact.contactId === oldContact.contactId) {
          newState.contacts[i] = contact;
          NotificationManager.update(newState.contacts[i]);
          console.log('Contact Updated: ', contact);
          break;
        }
      }
      return newState;
    }

    default:
      return contactsState;
  }
}
