import React, { Component } from 'react';
import moment from 'moment';
import { checkPermission } from 'react-native-contacts';
import { ContactFreqs } from '../../components/ContactUtils';

export const Contact = (props) => {
	const { contactID, firstName, lastName, phoneNumber, thumbnail, priority, contactMethod, lastContact, nextContact, notes } = props

	initialContactTime = (priority) => {
		let freq = ContactFreqs[priority];
		let start = Math.floor(freq / 2);

		let rand = Math.floor(Math.random() * freq) - start;
		let days = start + rand + 1;

		let today = Math.round(new Date().getTime());
		let toc = today + (days * 24 * 60 * 60 * 1000);
		return new Date(toc);
	}

	return (
		{
			contactId: contactID,
			firstName: firstName,
			lastName: lastName,
			phoneNumber: phoneNumber,
			thumbnail: thumbnail,
			priority: priority,
			contactFrequency: ContactFreqs[priority],
			contactMethod: contactMethod,
			lastContact: 0,
			nextContact: initialContactTime(priority),
			notes: notes,
		}
	)
}

export default class ContactManager {
	static contacts = []

	addContact(contact) {
		ContactManager.contacts.push(contact)
		console.log("Contact Added:", contact)
	}

	allContacts() {
		return ContactManager.contacts;
	}
}