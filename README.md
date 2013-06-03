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

    bash <(curl -sk https://raw.github.com/calmh/zsnapper/master/install.sh)

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

