import React, { Component } from 'react';
import moment from 'moment';
import { checkPermission } from 'react-native-contacts';
import Theme from '../../components/Theme';

export const ContactPriority = {
	Remove: {
		rawValue: -1,
		text: 'Remove',
		color: Theme.Green,
		fadeColor: Theme.FadedGreen,
		imageColor: Theme.Green,
		frequency: 0,
	},
	Friend: {
		rawValue: 0,
		text: 'Friend',
		color: Theme.Green,
		fadeColor: Theme.FadedGreen,
		imageColor: Theme.Green,
		frequency: 30,
	},
	Acquaintance: {
		rawValue: 1,
		text: 'Acquaintance',
		color: Theme.Blue,
		fadeColor: Theme.FadedBlue,
		imageColor: Theme.DarkBlue,
		frequency: 90,
	},
	TouchPoint: {
		rawValue: 2,
		text: 'Touchpoint',
		color: Theme.Purple,
		fadeColor: Theme.FadedPurple,
		imageColor: Theme.Purple,
		frequency: 0,
	},
};

export const ContactFrequency = {
	0: 30, // days (1 month)
	1: 90, // days (1 quarter)
	2: 365, // days (1 year)
};

export const SnoozeFrequency = {
	0: 5, // days (5 days)
	1: 10, // days (10 days)
	2: 15, // days (15 days)
};

export const ContactMethods = {
	Contact: {
		text: 'Contact',
	},
	Call: {
		text: 'Call',
	},
	Text: {
		text: 'Text',
	},
	Email: {
		text: 'Email',
	},
	FacebookMessage: {
		text: 'Facebook Message',
	},
};

export function sortContacts(contact1, contact2) {
	if (contact1.lastName === "") return 1;
	if (contact2.lastName === "") return -1;
	if (contact1.lastName < contact2.lastName) return -1;
	else if (contact1.lastName > contact2.lastName) return 1;
	else {
		if (contact1.firstName < contact2.firstName) return -1;
		else if (contact1.firstName > contact2.firstName) return 1;
	}

	return 0;
}

export class Contact {
	static fullName = (contact) => {
		return `${contact.firstName} ${contact.lastName}`.trim();
	};

	static setPriority(contact, priority) {
		contact.priority = priority;
		if (contact.priority !== ContactPriority.Remove.rawValue) {
			contact.contactFrequency = ContactFrequency[priority];
			contact.nextContact = Contact.initialContactTime(priority);
		}
	}

	static initialContactTime = priority => {
		let freq = ContactFrequency[priority];
		let start = Math.floor(freq / 2);

		let rand = Math.floor(Math.random() * freq) - start;
		let days = start + rand + 1;

		let today = Math.round(new Date().getTime());
		let toc = today + days * 24 * 60 * 60 * 1000;
		const result = new Date(toc);
		return result;
	};

	static phoneNumberCleaned = (contact) => {
		return contact.phoneNumber.replace(/\D/g, '');
	};

	constructor(props) {
		let {
			info,
			contactId,
			firstName,
			lastName,
			phoneNumber,
			thumbnail,
			priority,
			contactMethod,
			lastContact,
			notes,
		} = props;
		if (info) {
			this.contactId = info.recordID;
			this.firstName = info.givenName ? info.givenName : '';
			this.lastName = info.familyName ? info.familyName : '';

			if (info.phoneNumbers && info.phoneNumbers.length > 0) {
				const phoneNumbers = info.phoneNumbers.map((item, index) => {
					if (item.number && item.number !== '') {
						return item.number;
					}
				});
				this.phoneNumber =
					phoneNumbers && phoneNumbers.length > 0 ? phoneNumbers[0] : '';
			}
			this.thumbnail = info.thumbnailPath;
			this.priority = ContactPriority.Remove.rawValue;
			this.contactMethod = ContactMethods.Call.text;
			this.lastContact = 0;
			this.nextContact = null;
			this.notes = '';
		} else {
			this.contactId = contactId;
			this.firstName = firstName ? firstName : '';
			this.lastName = lastName ? lastName : '';
			this.phoneNumber = phoneNumber ? phoneNumber : '';
			this.thumbnail = thumbnail ? thumbnail : '';
			this.priority = priority;
			this.contactMethod = contactMethod;
			this.contactFrequency = ContactFrequency[priority];
			this.lastContact = lastContact;
			this.nextContact = this.initialContactTime(priority);
			this.notes = notes ? notes : '';
		}
	}
}

export default class ContactManager {
	static contacts = [];

	addContact(contact) {
		ContactManager.contacts.push(contact);
		console.log('Contact Added:', contact);
	}

	allContacts() {
		return ContactManager.contacts;
	}
}
