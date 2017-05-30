'use strict';
const path = require('path');
const context = require('kap-plugin-mock-context');

// Available export formats
const formats = ['gif', 'mp4', 'webm', 'apng'];

module.exports = plugin => {
	const services = plugin.shareServices;

	if (services.length === 0) {
		throw new Error('No services found');
	}

	const service = services[0];

	return (file, opts) => {
		opts = Object.assign({}, opts);

		const type = path.extname(file).slice(1);

		if (!formats.includes(type)) {
			throw new Error(`Invalid file type, should be one of ${formats.join(', ')}`);
		}

		const config = Object.create(null);

		for (const key of Object.keys(service.config || {})) {
			if (Object.prototype.hasOwnProperty.call(opts.config, key)) {
				config[key] = opts.config[key];
			} else {
				config[key] = service.config[key].default;
			}
		}

		const ctx = context({
			file,
			format: type.ext,
			config
		});

		return {
			context: ctx,
			exec: () => service.action(ctx)
		};
	};
};
