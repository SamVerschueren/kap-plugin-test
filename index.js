'use strict';
const path = require('path');
const context = require('kap-plugin-mock-context');
const importFrom = require('import-from');
const sinon = require('sinon');

// Available export formats
const formats = ['gif', 'mp4', 'webm', 'apng'];

module.exports = (file, opts) => {
	opts = Object.assign({
		config: {},
		cwd: process.cwd()
	}, opts);

	const plugin = importFrom(opts.cwd, '.');

	const services = plugin.shareServices;

	if (services.length === 0) {
		throw new Error('No services found');
	}

	const service = services[0];

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
