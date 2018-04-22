#!/bin/bash
# enable display with preferred settings
/opt/vc/bin/tvservice -p
# ...however this somehow requires a hack (switching between terminals) to function
# switch to terminal 1
sudo chvt 1
# switch back to terminal 7 with the desktop
sudo chvt 7
# move mouse out of the way
xdotool mousemove 10000 10000
