::: title
Building SerenityOS on macOS
:::

::: description
A few workarounds I needed to build Serenity on my machine.
:::

SerenityOS is an operating system built by the SerenityOS contributors, started
by Andreas Kling.

To run it on macOS, I had to do a few workarounds that didn't quite follow the
build instructions.

### To build Serenity on macOS,

Begin to follow the [official build instructions](https://github.com/SerenityOS/serenity/blob/master/Documentation/BuildInstructions.md).

Before the step of running

```
Toolchain/BuildFuseEx2.sh
```

You'll need to run the following command to fix a warning about Xcode (You'll also need the CLI tools from `xcode-select --install`, but that's usually a safe assumption if you're developing on macOS).

```
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Next, when at the `make image` stage, I needed to run it twice. The first time, you'll need to allow a system extension in System Preferences, which makes the step fail.

Before running `make image` again, run:

```
sudo mv ./mnt ./mnt.old
```

This just gets some files from the failed attempt out of the way.

After then running `make image` again, you should just be able to do `make run` to boot Serenity in QEMU.

### Side-note

One last interesting note is that booting Serenity in QEMU instantly and **dramatically** decreased the audio quality of the wireless headphones I had connected. I just thought that was interesting.

### Side-note update

My speculation for why this happens is that Serenity accessed the mic in the headphones. Bluetooth streaming the audio & mic at the same time reduces audio quality.
