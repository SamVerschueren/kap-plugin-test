# kap-plugin-test [![Build Status](https://travis-ci.org/SamVerschueren/kap-plugin-test.svg?branch=master)](https://travis-ci.org/SamVerschueren/kap-plugin-test)

> Test your [Kap](https://github.com/wulkano/kap) plugins


## Install

```
$ npm install --save-dev kap-plugin-test
```


## Usage

```js
import test from 'ava';
import sinon from 'sinon';
import kapPluginTest from 'kap-plugin-test';
import myPlugin from '.';

test(async t => {
	const service = kapPluginTest(myPlugin);

	const plugin = service('path/to/input.gif', {
		config: {
			apiKey: 'a3b78f9ce6'
		}
	});

	plugin.context.request.resolves({url: 'http://gph.is/1TGDci8'})

	await plugin.exec();

	t.true(plugin.context.copyToClipboard.calledWith('http://gph.is/1TGDci8'));
});
```


## API

### kapPluginTest(module)

Returns a [`service`](#servicefile-options) function.

#### module

Type: `module`

The plugin module.

### service(file, [options])

Returns a [`plugin`](#plugin) object.

##### file

Type: `string`

Path to the file that is being processed.

##### config

Type: `object`<br>
Default: `{}`

Plugin configuration object.

### plugin

#### .exec()

Execute the plugin.

#### .context

Access the plugin context object. All methods are SinonJS [spies](http://sinonjs.org/releases/v2.3.2/spies/), except for `request` which is a [stub](http://sinonjs.org/releases/v2.3.2/stubs/).


## Related

- [kap-plugin-mock-context](https://github.com/SamVerschueren/kap-plugin-mock-context) - Kap plugin mock context


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
