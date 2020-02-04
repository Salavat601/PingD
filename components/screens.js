import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import ContactsPage from './ContactsPage/ContactsPage';
import PingList from './PingList/PingList';
import CalendarPage from './Calendar';
import Onboarding from './Onboarding/Onboarding';
import OnboardingContactsPage from './OnboardingContactsPage/OnboardingContactsPage';
import AddContactsPage from './ContactsPage/AddContactsPage';

function ReduxProvider(store, persistor, Component) {
	return (props) => (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Component {...props} />
			</PersistGate>
		</Provider>
	);
}

export function registerScreens(store, persistor) {
	Navigation.registerComponent('PingD.Contacts', () => ReduxProvider(store, persistor, ContactsPage), () => ContactsPage);
	Navigation.registerComponent('PingD.PingList', () => ReduxProvider(store, persistor, PingList), () => PingList);
	Navigation.registerComponent('PingD.Calendar', () => ReduxProvider(store, persistor, CalendarPage), () => CalendarPage);
	Navigation.registerComponent('PingD.Onboarding', () => ReduxProvider(store, persistor, Onboarding), () => Onboarding);
	Navigation.registerComponent('PingD.OnboardingContacts', () => ReduxProvider(store, persistor, OnboardingContactsPage), () => OnboardingContactsPage);
	Navigation.registerComponent('PingD.AddContacts', () => ReduxProvider(store, persistor, AddContactsPage), () => AddContactsPage);

	/*
	Navigation.registerComponentWithRedux('PingD.Calendar', () =>
		CalendarPage, Provider, store
	);
	Navigation.registerComponentWithRedux('PingD.Contacts', () =>
		ContactsPage, Provider, store
	);
	Navigation.registerComponentWithRedux('PingD.PingList', () =>
		PingList, Provider, store
	);
	Navigation.registerComponentWithRedux('PingD.Onboarding', () =>
		Onboarding, Provider, store
	);
	Navigation.registerComponentWithRedux('PingD.OnboardingContacts', () =>
		OnboardingContactsPage, Provider, store
	);
	Navigation.registerComponentWithRedux('PingD.AddContacts', () =>
		AddContactsPage, Provider, store
	);
	*/
}
