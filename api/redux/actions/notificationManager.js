import React from 'react';
import {Notifications} from 'react-native-notifications';
import ContactManager, {Contact} from '../../models/contactManager';
import {Event} from '../../models/eventManager';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import {isIOS, isAndroid} from '../../../helpers/platformManager';

function phoneNumber(contact) {
	if (!contact || !contact.phoneNumber) return '0';
	return contact.phoneNumber;
}

function phoneNumberToID(phoneNumber) {
	if (phoneNumber === undefined) {
		return '';
	}

	let id = phoneNumber.replace(/\D/g, '');
	const maxLength = isIOS ? 10 : 5;
	if (id.length > maxLength) {
		id = id.substring(0, maxLength);
	}
	return id;
}

function notificationId(contact) {
	// return parseInt(phoneNumberToID(phoneNumber(contact)))
	return phoneNumberToID(phoneNumber(contact));
}

export function register(contact) {
	cancel(contact);
	const message = `${contact.contactMethod} ${contact.firstName} ${contact.lastName} today!`;
	const d = new Date(contact.nextContact);
	const day = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0, 0, 0);
	console.log('Notification Scheduled: ', day);
	const id = notificationId(contact);

	PushNotification.localNotificationSchedule({
		// Android Only Properties
		id: id,
		ticker: 'My Notification Ticker', // (optional)
		autoCancel: false, // (optional) default: true
		largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
		smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
		bigText: message, // (optional) default: "message" prop
		color: 'blue', // (optional) default: system default
		vibrate: true, // (optional) default: true
		vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
		priority: 'high', // (optional) set notification priority, default: high
		visibility: 'public', // (optional) set notification visibility, default: private
		importance: 'high', // (optional) set notification importance, default: high

		// iOS and Android properties
		title: "Today's Pings", // (optional)
		// number: "none",
		message: message, // (required)
		playSound: true, // (optional) default: true
		soundName: 'default', // (optional) Sound to play when the notification is shown
		date: day,
	});
}

export function cancel(contact) {
	if (!contact || !contact.phoneNumber) return;

	var id = notificationId(contact);
	PushNotification.cancelLocalNotifications({id: id});
	return;
}
export function update(contact) {
	register(contact);
}

function eventNotificationId(event) {
	const date = moment(event.date).format('YYYYMMDD');
	const notificationId = `${event.eventId}${date}`;
	return notificationId;
}

export function registerEvent(event) {
	cancelEvent(event);
	const message = event.comment;
	const day = new Date(
		event.date.getFullYear(),
		event.date.getMonth(),
		event.date.getDate(),
		9,
		0,
		0,
		0,
	);
	console.log('Event Notification Scheduled: ', id);
	const id = eventNotificationId(event);

	PushNotification.localNotificationSchedule({
		// Android Only Properties
		id: id,
		ticker: 'My Notification Ticker', // (optional)
		autoCancel: false, // (optional) default: true
		largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
		smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
		bigText: message, // (optional) default: "message" prop
		color: 'blue', // (optional) default: system default
		vibrate: true, // (optional) default: true
		vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
		priority: 'high', // (optional) set notification priority, default: high
		visibility: 'public', // (optional) set notification visibility, default: private
		importance: 'high', // (optional) set notification importance, default: high

		// iOS and Android properties
		title: "Today's Pings", // (optional)
		// number: "none",
		message: message, // (required)
		playSound: true, // (optional) default: true
		soundName: 'default', // (optional) Sound to play when the notification is shown
		date: day,
	});
}

export function cancelEvent(event) {
	var id = eventNotificationId(event);
	PushNotification.cancelLocalNotifications({id: id});
	return;
}
