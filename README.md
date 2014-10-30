# node-android-emulator [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)

Manage android emulators from your NodeJS scripts.

```js
var emulator = require('node-android-emulator');
```

Make sure to install [Intel HAXM](https://software.intel.com/en-us/android/articles/intel-hardware-accelerated-execution-manager) to have better perfs using x86 images.

## API

Every call returns a Promise.

### list()

return existing AVD

```js
emulator.list();
```

### create(name, options)

create a new AVD using given options. Options are the same as in the [Android AVD options](http://developer.android.com/tools/devices/managing-avds-cmdline.html) without the dashes. We provide some sample configurations in `sample-emulators.json`

```js
emulator.create('Nexus7-4.4.3', {
    abi: 'x86',
    target: 'android-19',
    skin: '1280x800'
});
```

### start(name)

Start the given AVD. Promise is fulffiled when device is full booted.

```js
emulator.start('Nexus7-4.4.3');
```

### stop(name)

Stop the given AVD.

```js
emulator.start('Nexus7-4.4.3');
```
