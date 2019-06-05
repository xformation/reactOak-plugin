import axios from 'axios';

export default class Utils {
	
	static postReq(url, data, callback) {
		axios.post(
			url,
			data
		).then((response) => {
			callback(response);
		}).catch((error) => {
			console.log("Create Err: ", error);
			callback(null, error);
		});
	}
}