import test from 'ava';
import m from '..';

test('no services', t => {
	t.throws(() => m({cwd: 'test/fixtures/empty'}), 'No services found');
});

test('invalid file type', t => {
	const service = m({cwd: 'test/fixtures/unicorn'});

	t.throws(() => service('test.js'), 'Invalid file type, should be one of gif, mp4, webm, apng');
});

test('context object', t => {
	const service = m({cwd: 'test/fixtures/unicorn'});

	const {context} = service('test.gif', {
		config: {
			foo: 'bar',
			unicorn: '🌈'
		}
	});

	t.is(context.format, 'gif');
	t.is(context.config.get('unicorn'), '🌈');
	t.false(context.config.has('foo'));
});

test('execute plugin', async t => {
	const service = m({cwd: 'test/fixtures/unicorn'});

	const plugin = service('test.gif', {
		config: {
			unicorn: '🌈'
		}
	});

	t.is(await plugin.run(), '🌈');
});

test('stub request', async t => {
	const service = m({cwd: 'test/fixtures/request'});

	const plugin = service('test.gif');

	plugin.context.request.resolves({
		url: 'http://myapi.com/123.gif'
	});

	await plugin.run();

	t.true(plugin.context.copyToClipboard.calledWith('http://myapi.com/123.gif'));
});
