import test from 'ava';
import m from '..';

test('no services', t => {
	t.throws(() => m('test.gif', {cwd: 'test/fixtures/empty'}), 'No services found');
});

test('invalid file type', t => {
	t.throws(() => m('test.js', {cwd: 'test/fixtures/unicorn'}), 'Invalid file type, should be one of gif, mp4, webm, apng');
});

test('invalid service', t => {
	t.throws(() => m('test.gif', {service: '1', cwd: 'test/fixtures/multi'}, 'Expected `service` to be of type `number`, got `string`'));
});

test('context object', t => {
	const {context} = m('test.gif', {
		cwd: 'test/fixtures/unicorn',
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
	const plugin = m('test.gif', {
		cwd: 'test/fixtures/unicorn',
		config: {
			unicorn: '🌈'
		}
	});

	t.is(await plugin.run(), '🌈');
});

test('execute plugin with different service', async t => {
	const plugin = m('test.gif', {
		service: 1,
		cwd: 'test/fixtures/multi'
	});

	t.is(await plugin.run(), '🌈');
});

test('stub request', async t => {
	const plugin = m('test.gif', {
		cwd: 'test/fixtures/request'
	});

	plugin.context.request.resolves({
		url: 'http://myapi.com/123.gif'
	});

	await plugin.run();

	t.true(plugin.context.copyToClipboard.calledWith('http://myapi.com/123.gif'));
});
