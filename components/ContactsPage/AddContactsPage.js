import React, { Component } from 'react';
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	PermissionsAndroid,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import Contacts from 'react-native-contacts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as appActions from '../../api/redux/actions/appActions/changeRoot';

import AppBar from '../generic/AppBar';
import ContactSeparator from '../generic/ContactSeparator';
import OnboardingContactCard from '../OnboardingContactsPage/OnboardingContactCard';
import Theme from '../Theme';
import PlatformManager from '../../helpers/platformManager';
import ContactManager, { Contact } from '../../api/models/contactManager'

const ContinueButton = props => (
	<TouchableOpacity
		onPress={props.continue}
		style={buttonStyles.continueButtonWrapper}>
		<View style={buttonStyles.continueButton}>
			<Image
				style={buttonStyles.continueButtonImg}
				source={require('../../assets/check.png')}
			/>
		</View>
	</TouchableOpacity>
);

ContinueButton.propTypes = {
	continue: PropTypes.func,
};

const buttonStyles = StyleSheet.create({
	continueButtonWrapper: {
		position: 'absolute',
		right: 20,
		top: 52,
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	continueButton: {
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		backgroundColor: Theme.Blue,
		borderRadius: 25,
		borderWidth: 3,
		borderColor: Theme.White,
		shadowColor: Theme.Black,
		shadowOpacity: 0.16,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 6,
	},
	continueButtonImg: {
		resizeMode: 'contain',
		width: 36,
		height: 36,
	},
});

function compareContacts(c1, c2) {
	if (c1.familyName < c2.familyName) return -1;
	else if (c1.familyName > c2.familyName) return 1;
	else {
		if (c1.givenName < c2.givenName) return -1;
		else if (c1.givenName > c2.givenName) return 1;
	}

	return 0;
}

class AddContactsPage extends Component {
	constructor(props) {
		super(props);

		var numbers = Object.entries(this.props.contacts).map(([key, value]) => {
			return value.contact.phoneNumber;
		});

		this.state = {
			savedNumbers: numbers,
			contacts: [],
			searchResult: [],
			search: '',
		};

		this._getContacts = this._getContacts.bind(this);
		this.renderContactCard = this.renderContactCard.bind(this);
		this._startApp = this._startApp.bind(this);

		this._getContacts();
	}

	searchContacts(search) {
		const { contacts } = this.state;
		searchResult = contacts.filter(function (contact) {
			if (!search || search == '') {
				return true;
			}

			if (contact.givenName && contact.givenName.indexOf(search) != -1) {
				console.log('Given Name is Matched.');
				return true;
			}

			if (contact.familyName && contact.familyName.indexOf(search) != -1) {
				console.log('Family Name is Matched.');
				return true;
			}

			if (contact.phoneNumbers) {
				for (let i = 0; i < contact.phoneNumbers.length; i++) {
					if (contact.phoneNumbers[i].number.indexOf(search) != -1) {
						return true;
					}
				}
			}

			// console.log("%s,%s,%s", search, contact.givenName, contact.familyName);

			return false;
		});

		this.setState({
			search: search,
			searchResult: searchResult,
		});
	}

	onSearchKeyChanged = search => {
		this.searchContacts(search);
	};

	onContactsFetched(err, contacts) {
		if (err) {
			console.log(err);
			return;
		}

		const savedContacts = this.props.contacts
		let savedNumbers = []
		for (let i = 0; i < savedContacts.length; i++) {
			const contact = savedContacts[i].contact
			savedNumbers.push(contact.phoneNumber)
		}
		console.log("Saved Numbers: ", savedNumbers)

		if (!contacts) {
			console.log('Contacts is empty.');
			return;
		}

		contacts = contacts.filter(function (contact) {
			// system contact
			if (contact.givenName.startsWith('#')) return false;
			// filter no-name contacts
			if (contact.givenName === '' && contact.familyName === '') return false;
			// Check if number is already in an imported contact

			if (contact.phoneNumbers.length > 0 && savedNumbers !== undefined) {
				const phoneNumber = contact.phoneNumbers[0].number
				if (savedNumbers.indexOf(phoneNumber) != -1) {
					console.log("Found Saved Number: ", phoneNumber)
					return false
				}
			}

			return true;
		});

		this.setState({ contacts: contacts.sort(compareContacts) });
		this.searchContacts(this.state.search);
	}

	_getContacts() {
		if (Platform.OS == 'ios') {
			Contacts.getAll((err, contacts) => {
				this.onContactsFetched(err, contacts);
			});
		} else {
			PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
				title: 'Contacts',
				message: 'This app would like to view your contacts.',
				buttonPositive: 'Please accept bare mortal',
			}).then(() => {
				Contacts.getAll((err, contacts) => {
					this.onContactsFetched(err, contacts);
				});
			});
		}
	}

	renderContactCard(contact) {
		if (contact.item.isSeparator)
			return <ContactSeparator letter={contact.item.letter} />;

		let first = contact.item.givenName ? contact.item.givenName : '';
		let last = contact.item.familyName ? contact.item.familyName : '';
		let phone;
		if (!contact.item.phoneNumbers.length || !contact.item.phoneNumbers[0])
			phone = '';
		else
			phone = contact.item.phoneNumbers[0].number;

		return (
			<OnboardingContactCard
				contactID={contact.item.recordID}
				firstName={first}
				lastName={last}
				phoneNumber={phone}
				thumbnail={contact.item.thumbnailPath}
			/>
		);
	}

	addContactSeparators(contacts) {
		let processed = [];
		let lastInitial = null;

		for (var i = 0; i < contacts.length; i++) {
			let initial = (contacts[i].familyName === String) ? contacts[i].familyName.substring(0, 1) : null;
			if (initial != lastInitial) {
				processed.push({ isSeparator: true, letter: initial });
				lastInitial = initial;
			}

			processed.push(contacts[i]);
		}

		return processed;
	}

	_startApp() {
		this.props.startMainApp();
	}

	render() {
		let contactList = null;
		const { search } = this.state;
		if (this.state.contacts.length > 0)
			contactList = (
				<FlatList
					contentContainerStyle={styles.contactList}
					data={this.addContactSeparators(this.state.searchResult)}
					keyExtractor={(item, index) => index.toString()}
					renderItem={this.renderContactCard}
				/>
			);

		return (
			<View style={styles.container}>
				<AppBar>
					<Text style={styles.appBarText}>{'Select your contacts'}</Text>
					<ContinueButton continue={this._startApp} />
				</AppBar>
				<SearchBar
					inputContainerStyle={{ backgroundColor: 'white' }}
					containerStyle={{ backgroundColor: 'white' }}
					placeholder="Type Here..."
					onChangeText={this.onSearchKeyChanged}
					value={search}
				/>
				{contactList}
			</View>
		);
	}
}

AddContactsPage.propTypes = {
	navigator: PropTypes.object,
	startMainApp: PropTypes.func,
};

const styles = StyleSheet.create({
	appBarText: {
		fontSize: 20,
		fontWeight: '600',
		color: Theme.White,
		marginTop: 18,
	},
	container: {
		flex: 1,
		backgroundColor: Theme.White,
	},
	contactList: {
		padding: 20,
	},
});

const mapStateToProps = state => {
	return {
		contacts: state.contacts,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		startMainApp: () => dispatch(appActions.contactsDoneImporting()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddContactsPage);
