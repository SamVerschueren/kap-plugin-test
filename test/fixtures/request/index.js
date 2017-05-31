'use strict';
const action = async context => {
	const response = await context.request('http://myapi.com');

	context.copyToClipboard(response.url);
};

const service = {
	title: 'Share to 🌈',
	formats: ['gif'],
	action,
	config: {
		unicorn: {
			title: 'Rainbow',
			type: 'string',
			default: '🌈',
			required: true
		}
	}
};

exports.shareServices = [service];
