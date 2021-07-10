import CryptoJS from 'crypto-js';
const App = 'app key';

function enc(param) {
	const key = App.map((char) => String.fromCharCode(char)).toString().replace(/,/g, '');
	const ak = CryptoJS.AES.encrypt(JSON.stringify(param), key).toString();
	const pr = CryptoJS.HmacSHA512(JSON.stringify(param), key).toString();
	const p = {params: pr, ApiKey: ak};
	return CryptoJS.AES.encrypt(JSON.stringify(p), key).toString();
}

function dec(res) {
	if (typeof res !== 'string') {
		return {status: 'failed'};
	}
	const key = App.map((char) => String.fromCharCode(char)).toString().replace(/,/g, '');
	const bytes = CryptoJS.AES.decrypt(res, key);
	const p = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
	const b = CryptoJS.AES.decrypt(p.ApiKey, key);
	const s = b.toString(CryptoJS.enc.Utf8);
	const pr = CryptoJS.HmacSHA512(s, key).toString();
	if (pr === p.params) {
		return JSON.parse(s);
	} else {
		return {status: 'failed'};
	}
}

export default {enc, dec};
