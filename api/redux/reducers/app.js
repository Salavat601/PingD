import {ROOT_CHANGED} from '../actions/appActions/changeRoot';

const initialState = {
	root: 'login',
};

export default function app(state = initialState, action) {
	switch (action.type) {
		case ROOT_CHANGED:
			return Object.assign({}, {root: action.root});
		default:
			return state;
	}
}
