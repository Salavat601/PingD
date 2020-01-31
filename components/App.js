import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import configureStore from '../api/redux/store.js';
import * as appActions from '../api/redux/actions/appActions/changeRoot';

import { registerScreens } from './screens';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Theme from '../components/Theme';
import PlatformManager from '../helpers/platformManager';
import NotificationsIOS, { NotificationsAndroid } from 'react-native-notifications';

const storage = configureStore();
registerScreens(storage.store, Provider);

export default class App extends Component {
	constructor(props) {
		super(props);

		// NOTE: uncomment following line to purge state of app and run app once
		storage.persistor.purge();
		storage.store.subscribe(this.onStoreUpdate.bind(this));
		storage.store.dispatch(appActions.appInitialized());
	}

	componentDidMount() {
		if (PlatformManager.isIOS) {
			NotificationsIOS.requestPermissions();
		}
		/* Android */
		if (PlatformManager.isAndroid) {
			NotificationsAndroid.setRegistrationTokenUpdateListener(this.onPushRegistered);
		}
	}

	onPushRegistered = async deviceToken => {
		// TODO: Send the token to my server so it could send back push notifications...
		console.log(deviceToken);
	};

	onStoreUpdate() {
		let { root } = storage.store.getState().app;
		if (this.currentRoot != root) {
			this.currentRoot = root;
			this.startApp(root);
		}
	}

	startApp(root) {



		switch (root) {
			case 'app': {
				Navigation.setRoot({
					root: {
						bottomTabs: {
							children: [{
								component: {
									name: 'PingD.Contacts',
									options: {
										bottomTab: { text: 'Contacts', icon: require('../assets/contacts_unselected.png'), selectedIcon: require('../assets/contacts_selected.png'), },
										topBar: { visible: false, animate: false, }
									}
								}
							}, {
								component: {
									name: 'PingD.PingList',
									options: {
										bottomTab: { text: 'Ping List', icon: require('../assets/ping_list_unselected.png'), selectedIcon: require('../assets/ping_list_selected.png'), },
										topBar: { visible: false, animate: false, }
									}
								}
							}, {
								component: {
									name: 'PingD.Calendar',
									options: {
										bottomTab: { text: 'Calendar', icon: require('../assets/calendar_unselected.png'), selectedIcon: require('../assets/calendar_selected.png'), },
										topBar: { visible: false, animate: false, }
									}
								}
							},]
						}
					}
				});
				return;
			}

			case 'login': {
				Navigation.events().registerAppLaunchedListener(() => {
					Navigation.setDefaultOptions({
						bottomTabs: { backgroundColor: 'white', barStyle: 'default', translucent: false, },
						bottomTab: { selectedTextColor: Theme.Blue, },
					});

					Navigation.setRoot({
						root: {
							stack: {
								children: [{
									component: {
										name: 'PingD.Onboarding',
										options: {
											topBar: { visible: false, animate: false, }
										},
										passProps: { text: 'stack with one child' },
									}
								}],
							}
						}
					});
				})
				return;
			}

			case 'importing': {
				Navigation.setRoot({
					root: {
						stack: {
							children: [{
								component: {
									name: 'PingD.OnboardingContacts',
									options: {
										topBar: {
											visible: false,
											animate: false,
										}
									},
								}
							}],

						}
					}
				});
				return;
			}

			case 'addNew': {
				Navigation.setRoot({
					root: {
						stack: {
							children: [{
								component: {
									name: 'PingD.AddContacts',
									options: {
										topBar: {
											visible: false,
											animate: false,
										}
									},
								}
							}],

						}
					}
				});
				return;
			}

			default:
				console.log('Error occurred');
		}
	}
}
