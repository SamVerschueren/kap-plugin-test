'use strict';
const action = context => {
	return context.config.get('apiKey');
};

const unicornService = {
	title: 'Share to 🦄',
	formats: ['gif', 'mp4', 'webm', 'apng'],
	action,
	config: {
		apiKey: {
			title: 'Unicorn',
			type: 'string',
			default: '🦄',
			required: true
		}
	}
};

const rainbowService = {
	title: 'Share to 🌈',
	formats: ['gif', 'mp4', 'webm', 'apng'],
	action,
	config: {
		apiKey: {
			title: 'Rainbow',
			type: 'string',
			default: '🌈',
			required: true
		}
	}
};

exports.shareServices = [
	unicornService,
	rainbowService
];
