'use strict';
const action = context => {
	return context.config.get('unicorn');
};

const service = {
	title: 'Share to 🦄',
	formats: ['gif', 'mp4', 'webm', 'apng'],
	action,
	config: {
		unicorn: {
			title: 'Unicorn',
			type: 'string',
			default: '🦄',
			required: true
		}
	}
};

exports.shareServices = [service];
