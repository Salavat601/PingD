import React, { Component } from 'react';

export const EventType = (props) => {
	const { title, icon, color } = props;
	return (
		{
			title: title,
			icon: icon,
			color: color,
		}
	)
}

export default class EventTypes {
	static all = [
		new EventType({
			title: 'Friend Milestone',
			icon: require('../../assets/event_friend_milestone.png'),
			color: '#b410d6',
		}),
		new EventType({
			title: 'Social Event',
			icon: require('../../assets/event_social_event.png'),
			color: '#3839dc',
		}),
		new EventType({
			title: 'Birthday',
			icon: require('../../assets/event_bday.png'),
			color: '#5e916d',
		}),
		new EventType({
			title: 'Social Reminder',
			icon: require('../../assets/event_social_reminder.png'),
			color: '#2d4a59',
		}),
		/*
		<EventType
			title='Friend Milestone'
			icon={require('../../assets/event_friend_milestone.png')}
			color='#b410d6'
		/>,
		< EventType
			title='Social Event'
			icon={require('../../assets/event_social_event.png')}
			color='#3839dc'
		/>,
		< EventType
			title='Birthday'
			icon={require('../../assets/event_bday.png')}
			color='#5e916d'
		/>,
		< EventType
			title='Social Reminder'
			icon={require('../../assets/event_social_reminder.png')}
			color='#2d4a59'
		/>,
		*/
	];

	static event(index) {
		const allTypes = EventTypes.all
		if (index < 0 || index >= allTypes.length) {
			return null
		}

		const event = allTypes[index];
		return event;
	}
}