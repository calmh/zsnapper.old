#!/bin/bash

branch="master"
tar="https://codeload.github.com/calmh/zsnapper/tar.gz/$branch"
instdir="/opt/local"
config="/opt/local/etc/zsnapper.ini"
smf="/opt/custom/smf/zsnapper.xml"

fail() {
echo Installation failed
exit -1
}

echo "Installing into $instdir/zsnapper."

cd "$instdir" || fail
[ -d zsnapper.previous ] && rm -rf zsnapper.previous
[ -d zsnapper ] && mv zsnapper zsnapper.previous
( curl -sk "$tar" | gtar zxf - ) || fail
mv "zsnapper-$branch" zsnapper || fail

if [ ! -f "$config" ] ; then
echo "No config file, installing default into $config."
cp zsnapper/zsnapper.ini "$config" || fail
fi

if [ ! -f "$smf" ] ; then
echo "No SMF manifest, installing into $smf."
cp zsnapper/zsnapper.xml "$smf" || fail
fi

echo
echo "Installation complete."
echo " 1. Edit the config file $config to taste."
echo " 2. Import the SMF manifest to start the service:"
echo "    svccfg import $smf"
