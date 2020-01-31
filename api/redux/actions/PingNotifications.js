import React from 'react';
import { Notifications } from 'react-native-notifications';
import ContactManager, { Contact } from '../../models/contactManager';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';

function phoneNumber(contact) {
	if (!contact || !contact.phoneNumber)
		return "0";
	return contact.phoneNumber;
}

function phoneNumberToID(phoneNumber) {
	if (phoneNumber === undefined) {
		return "";
	}

	let id = phoneNumber.replace(/\D/g, '')
	if (id.length > 10) { id = id.substring(0, 10) }
	return id;
}

function notificationId(contact) {
	// return parseInt(phoneNumberToID(phoneNumber(contact)))
	return phoneNumberToID(phoneNumber(contact))
}

export function add(contact) {
	const message = `${contact.contactMethod} ${contact.firstName} ${contact.lastName} today!`;
	const d = new Date(contact.nextContact);
	const day = moment(new Date(d.getFullYear(), d.getMonth(), d.getDay(), 9, 0, 0)).toDate();
	console.log("Notification Scheduled: ", day)
	const id = notificationId(contact)

	/*
	Notifications.postLocalNotification({
		body: message,
		title: "Today's Pings",
		silent: false,
		category: "SOME_CATEGORY",
		fireDate: day,
		userInfo: {}
	}, id);
	*/

	PushNotification.localNotificationSchedule({
		// Android Only Properties
		id: id,
		ticker: "My Notification Ticker", // (optional)
		autoCancel: false, // (optional) default: true
		largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
		smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
		bigText: message, // (optional) default: "message" prop
		color: "blue", // (optional) default: system default
		vibrate: true, // (optional) default: true
		vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
		priority: "high", // (optional) set notification priority, default: high
		visibility: "public", // (optional) set notification visibility, default: private
		importance: "high", // (optional) set notification importance, default: high

		// iOS and Android properties
		title: "Today's Pings", // (optional)
		// number: "none",
		message: message, // (required)
		playSound: true, // (optional) default: true
		soundName: 'default', // (optional) Sound to play when the notification is shown
		date: day
	});
}

export function remove(contact) {
	if (!contact || !contact.phoneNumber)
		return

	var id = notificationId(contact)
	PushNotification.cancelLocalNotifications({ id: id });
	// Notifications.cancelLocalNotification(id);
	return
}
export function update(contact) {
	remove(contact);
	add(contact);
}