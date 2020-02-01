import React, { Component } from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AppBar from '../generic/AppBar';
import ContactCard from '../generic/ContactCard';
import ContactSeparator from '../generic/ContactSeparator';
import * as appActions from '../../api/redux/actions/appActions/changeRoot';
import ContactView from './ContactView';
import Theme from '../Theme';
import compareContacts from '../../utils/compareContacts';
import { Contact } from '../../api/models/contactManager'

function ContactListItem({ contact, onSelect }) {
	if (contact.isSeparator) {
		return <ContactSeparator letter={contact.letter} />
	}
	let name = contact.fullName();

	return (
		<TouchableOpacity
			style={styles.cardContainer}
			onPress={() => { onSelect(contact) }}>
			<ContactCard
				style={[styles.card]}
				name={name}
				phoneNumber={contact.phoneNumber}
				priority={contact.priority}
				thumbnail={contact.thumbnail}
			/>
		</TouchableOpacity>
	);
}

class ContactsPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			viewing: null,
		};
	}

	addContactSeparators(contacts) {
		let results = [];
		let lastInitial = null;

		for (let i = 0; i < contacts.length; i++) {
			let contact = contacts[i]
			let initial = contact.lastName.length > 0 ? contact.lastName.substring(0, 1) : "";
			if (initial != lastInitial) {
				results.push({ isSeparator: true, letter: initial });
				lastInitial = initial;
			}

			results.push(contact);
		}

		return results;
	}

	showContact(contact) {
		if (contact.isSeparator)
			return
		this.setState({ viewing: contact.contactId })
	}

	resetContact = () => {
		this.setState({ viewing: null });
	}

	render() {
		let contacts = this.props.contacts ? this.props.contacts : [];
		contacts.sort(compareContacts);

		let contactView = null;
		if (this.state.viewing) {
			let shownContact = contacts.find(contact => contact.contactId === this.state.viewing);
			if (shownContact) contactView = <ContactView contact={shownContact} reset={this.resetContact} />;
		}

		return (
			<View style={styles.container}>
				{contactView}
				<AppBar height={72}>
					<Text style={styles.title}>Contacts</Text>
				</AppBar>
				<FlatList
					contentContainerStyle={styles.contactList}
					data={this.addContactSeparators(contacts)}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) =>
						<ContactListItem
							contact={item}
							onSelect={() => { this.showContact(item) }} />
					}
				/>
				<TouchableOpacity onPress={() => this.props.addMoreContacts()}
					style={styles.addButton}>
					<Text style={styles.addButtonText}>Add More Contacts</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

ContactsPage.propTypes = {
	contacts: PropTypes.array.isRequired,
	navigator: PropTypes.object,
	addMoreContacts: PropTypes.func,
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Theme.White,
	},
	contactList: {
		padding: 20,
	},
	cardContainer: {
		marginTop: 10,
		marginBottom: 10,
	},
	card: {
		height: 80,
	},
	title: {
		fontSize: 20,
		fontWeight: '500',
		color: Theme.White,
		marginTop: 24,
	},
	addButton: {
		position: 'absolute',
		bottom: '2%',
		alignSelf: 'center',
		right: 0,
		left: 0,
		bottom: 0,
		height: 60,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Theme.White,
	},
	addButtonText: {
		flex: 1,
		top: 20,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 14,
		color: Theme.Blue
	}
});

const mapStateToProps = (state) => {
	return {
		contacts: state.contacts.contacts,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addMoreContacts: () => dispatch(appActions.addNew())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactsPage);
