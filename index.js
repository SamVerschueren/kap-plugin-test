'use strict';
const path = require('path');
const context = require('kap-plugin-mock-context');
const importFrom = require('import-from');
const sinon = require('sinon');

// Available export formats
const formats = ['gif', 'mp4', 'webm', 'apng'];

module.exports = (file, opts) => {
	opts = Object.assign({
		service: 0,
		config: {},
		cwd: process.cwd()
	}, opts);

	if (typeof opts.service !== 'number') {
		throw new TypeError(`Expected \`service\` to be of type \`number\`, got \`${typeof opts.service}\``);
	}

	const plugin = importFrom(opts.cwd, '.');

	const services = plugin.shareServices;

	if (!services || services.length === 0) {
		throw new Error('No services found');
	}

	const service = services[opts.service];

	if (!service) {
		throw new Error(`No service found at index \`${opts.service}\``);
	}

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

	sinon.spy(ctx, 'filePath');
	sinon.stub(ctx, 'request');
	sinon.spy(ctx, 'notify');
	sinon.spy(ctx, 'copyToClipboard');
	sinon.spy(ctx, 'setProgress');
	sinon.spy(ctx, 'openConfigFile');
	sinon.spy(ctx, 'cancel');

	return {
		context: ctx,
		run: () => service.action(ctx)
	};
};
