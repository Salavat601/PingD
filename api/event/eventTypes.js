import React, { Component } from 'react';

export default class EventTypes {
	static all = [
		{
			title: 'Friend Milestone',
			icon: require('../../assets/event_friend_milestone.png'),
			color: '#b410d6',
		},
		{
			title: 'Social Event',
			icon: require('../../assets/event_social_event.png'),
			color: '#3839dc',
		},
		{
			title: 'Birthday',
			icon: require('../../assets/event_bday.png'),
			color: '#5e916d',
		},
		{
			title: 'Social Reminder',
			icon: require('../../assets/event_social_reminder.png'),
			color: '#2d4a59',
		},
	];

	static event(index) {
		const event = EventTypes.all[index];
		return event;
	}
}