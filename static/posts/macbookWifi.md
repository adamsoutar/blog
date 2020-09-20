::: title
Fixing broken WiFi on a 2017 MacBook Pro
:::

::: description
Using AltStore on my Mac broke WiFi
:::

In an ill-fated effort to downgrade my iPad 2 to iOS 6, I used AltStore
on my MacBook Pro running Catalina 10.15.6. After giving up, I deleted
AltStore.app from Applications (and disabled its frankly worrying Mail plugin).
I noticed immediately afterward that my Mac would no-longer connect to the
internet - iCloud began to complain and Safari wouldn't load web pages, although
WiFi discovery was still working, and I was 'Connected with an IP Address' to my
home WiFi. I could also connect to Personal Hotspot, but the internet didn't
work over that either. It should be noted that Ethernet (through USB-C)
still worked perfectly.

To fix this issue, Apple Support told me to reinstall macOS (which isn't as bad
as it seems since you keep your files, etc.), but I wanted to hold off.

I actually fixed the issue by taking a Terminal to
`/Library/Preferences/SystemConfiguration` and, after backing up the whole
folder elsewhere, deleting the following files:

```
NetworkInterfaces-pre-upgrade-new-target.plist
NetworkInterfaces-pre-upgrade-source.plist
NetworkInterfaces.plist
com.apple.airport.preferences.plist
com.apple.wifi.message-tracer.plist
preferences-pre-upgrade-new-target.plist
preferences-pre-upgrade-source.plist
preferences.plist
```

Note: Some of these were probably unnecessary, but didn't hurt.

After doing so, emptying the Bin and restarting, WiFi was working again!
