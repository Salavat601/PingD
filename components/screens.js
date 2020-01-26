import { Navigation } from 'react-native-navigation';

import ContactsPage from './ContactsPage/ContactsPage';
import PingList from './PingList/PingList';
import Calendar from './Calendar';
import Onboarding from './Onboarding/Onboarding';
import OnboardingContactsPage
	from './OnboardingContactsPage/OnboardingContactsPage';
import AddContactsPage from './ContactsPage/AddContactsPage';

export function registerScreens(store, Provider) {
	Navigation.registerComponentWithRedux('PingD.Contacts', () =>
		ContactsPage, Provider, store
	);
	Navigation.registerComponentWithRedux('PingD.Calendar', () =>
		Calendar, Provider, store
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
}
