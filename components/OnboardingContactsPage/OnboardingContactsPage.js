import React, { Component } from 'react';
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Platform,
	PermissionsAndroid,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import Contacts from 'react-native-contacts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as appActions from '../../api/redux/actions/appActions/changeRoot';

import AppBar from '../generic/AppBar';
import ContactSeparator from '../generic/ContactSeparator';
import OnboardingContactCard from './OnboardingContactCard';
import Theme from '../Theme';
import ContactManager, {
	Contact,
	sortContacts,
} from '../../api/models/contactManager';

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
	description: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 6,
		fontSize: 8,
		alignSelf: 'center',
		textAlign: 'center',
	},
});

class OnboardingContactsPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			contacts: [],
			searchKey: '',
			searchResult: [],
		};

		this._getContacts = this._getContacts.bind(this);
		this.renderContactCard = this.renderContactCard.bind(this);
		this._startApp = this._startApp.bind(this);

		this._getContacts();
	}

	onContactsFetched(err, contactInfos) {
		if (err) {
			console.log(err);
			return;
		}

		if (!contactInfos) {
			console.log('Contacts is empty.');
			return;
		}

		let contacts = [];
		for (let i = 0; i < contactInfos.length; i++) {
			const contact = new Contact({ info: contactInfos[i] });
			if (
				!contact.firstName.startsWith('#') &&
				!(contact.firstName === '' && contact.lastName === '')
			) {
				contacts.push(contact);
			}
		}

		this.setState({ contacts: contacts.sort(sortContacts) });
		this.searchContacts('');
	}

	async _getContacts() {
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
		if (contact.isSeparator) {
			return <ContactSeparator letter={contact.letter} />;
		}

		return <OnboardingContactCard contact={contact} />;
	}

	addContactSeparators(contacts) {
		let results = [];
		let lastInitial = null;

		if (!contacts) {
			return results;
		}

		for (let i = 0; i < contacts.length; i++) {
			let initial =
				contacts[i].lastName.length > 0
					? contacts[i].lastName.substring(0, 1)
					: '';
			if (initial != lastInitial) {
				results.push({ isSeparator: true, letter: initial });
				lastInitial = initial;
			}

			results.push(contacts[i]);
		}

		return results;
	}

	_startApp() {
		this.props.startMainApp();
	}

	onSearchKeyChanged = search => {
		this.searchContacts(search);
	};

	searchContacts(search) {
		const { contacts } = this.state;
		const searchResult = contacts.filter(function (contact) {
			if (!search || search == '') {
				return true;
			}

			if (
				contact.firstName &&
				contact.firstName.toLowerCase().indexOf(search.toLowerCase()) != -1
			) {
				console.log('Given Name is Matched.');
				return true;
			}

			if (
				contact.lastName &&
				contact.lastName.toLowerCase().indexOf(search.toLowerCase()) != -1
			) {
				console.log('Family Name is Matched.');
				return true;
			}

			if (contact.phoneNumber && contact.phoneNumber.indexOf(search) != -1) {
				return true;
			}

			return false;
		});

		this.setState({
			searchKey: search,
			searchResult: searchResult,
		});
	}

	render() {
		let contactList = null;
		if (this.state.contacts.length > 0)
			contactList = (
				<FlatList
					contentContainerStyle={styles.contactList}
					data={this.addContactSeparators(this.state.searchResult)}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => this.renderContactCard(item)}
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
					onChangeText={text => {
						this.onSearchKeyChanged(text);
					}}
					value={this.state.searchKey}
				/>
				<Text style={styles.description}>
					Choose the contacts you want to stay in touch with!
				</Text>
				{contactList}
			</View>
		);
	}
}

OnboardingContactsPage.propTypes = {
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
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 20,
	},
	description: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 6,
		fontSize: 8,
		alignSelf: 'center',
		textAlign: 'center',
	},
});

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		startMainApp: () => dispatch(appActions.contactsDoneImporting()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(OnboardingContactsPage);
