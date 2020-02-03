import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { Navigation } from 'react-native-navigation';

import configureStore from '../api/redux/store.js';
import * as appActions from '../api/redux/actions/appActions/changeRoot';

import { registerScreens } from './screens';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Theme from '../components/Theme';
import { isIOS, isAndroid } from '../helpers/platformManager';
import { Notifications } from 'react-native-notifications';
import detectFirstLaunch from '../utils/detectFirstLaunch'

const {store, persistor} = configureStore();
registerScreens(store, persistor);

class App extends Component {
	constructor(props) {
		super(props);

		Notifications.registerRemoteNotifications();

		Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
			completion({ alert: false, sound: false, badge: false });
		});

		Notifications.events().registerNotificationOpened((notification, completion) => {
			completion();
		});

		// NOTE: uncomment following line to purge state of app and run app once
		// persistor.purge();
		store.subscribe(this.onStoreUpdate.bind(this));
		store.dispatch(appActions.appInitialized());
	}

	onPushRegistered = async deviceToken => {
		// TODO: Send the token to my server so it could send back push notifications...
		console.log(deviceToken);
	};

	onStoreUpdate() {
		let { root } = store.getState().app;
		if (this.currentRoot != root) {
			this.currentRoot = root;
			this.startApp(root);
		}
	}

	startApp(root) {
		switch (root) {
			case 'app': {
				if (isIOS) {
					Navigation.events().registerAppLaunchedListener(() => {
						Navigation.setDefaultOptions({
							bottomTabs: { backgroundColor: 'white', barStyle: 'default', translucent: false, },
							bottomTab: { selectedTextColor: Theme.Blue, },
						});

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
					})
				} else {
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
				}
				return;
			}

			case 'login': {
				if (isIOS) {
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
				} else {
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
				}

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

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {
		startAppImporting: () => dispatch(appActions.login()),
	};
};

export default App;