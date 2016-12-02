# This project is not actively maintained

Issues and pull requests on this repository may not be acted on in a timely
manner, or at all.  You are of course welcome to use it anyway. You are even
more welcome to fork it and maintain the results.

![Unmaintained](https://nym.se/img/unmaintained.jpg)

```
 _______ _ __   __ _ _ __  _ __   ___ _ __
|_  / __| '_ \ / _` | '_ \| '_ \ / _ \ '__|
 / /\__ \ | | | (_| | |_) | |_) |  __/ |
/___|___/_| |_|\__,_| .__/| .__/ \___|_|
                    |_|   |_|
```

This is a ZFS snapshotting service for Solaris, OpenIndiana, SmartOS and
friends. It takes periodic snapshots of the datasets you specify, at whatever
intervals you like. You tell it how many of each kind to keep around and the
rest gets cleaned out.

Installation
============

SmartOS
-------

Inspect the installation script to ensure a lack of shenanigans:

    curl -Lsk https://raw.githubusercontent.com/calmh/zsnapper/master/install.sh

Then either paste it to a file and run it yourself, or run it directly from the internet:

    bash <(curl -Lsk https://raw.githubusercontent.com/calmh/zsnapper/master/install.sh)

This will install into /opt/local/zsnapper and drop default config and manifest
into /opt/local/etc and /opt/custom/smf respectively. If the config is already
present it won't be overwritten, so this can be used for upgrades as well.

Non-SmartOS Solaris, Linux, or FreeBSD
--------------------------------------

    # npm -g install zsnapper

Copy the zsnapper.ini to a suitable place, start zsnapper with the location of
the config file as the only parameter. For Solaris, there's an example SMF in
zsnapper.xml.

License
-------

MIT

