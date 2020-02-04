export default function(contact1, contact2) {
	let c1 = contact1;
	let c2 = contact2;

	if (c1.firstName < c2.firstName) return -1;
	else if (c1.firstName > c2.firstName) return 1;
	else {
		if (c1.lastName < c2.lastName) return -1;
		else if (c1.lastName > c2.lastName) return 1;
	}

	return 0;
}
