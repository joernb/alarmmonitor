# Alarmmonitor

Show and update a website on a hardware display controlled by a Raspberry Pi.

This project contains an angular 1.x webapp which is intended to run in iceweasel fullscreen mode. The webapp is also capable of sending shell commands via websocket and receiving their output.

The `npm start` runs a websocket server using websocketd. This will open a shell once the webapp connects via websocket. Everything sent by the webapp will be executed as shell command and the output is sent back to the webapp.

The `detect-button-presses.py` script detects GPIO state changes and sends output to stdout. There is also a `simluate-button-presses.sh` script, that simulates the output of the script. 

The `display-on.sh` and `display-off.sh` scripts control the display standby mode using `/opt/vc/bin/tvservice`. Xdotool is used to move the mouse cursor out of the way.

# Setup
* Install dependencies with `npm install`
* Install websocketd from https://github.com/joewalnes/websocketd/wiki/Download-and-install
* Install xdotool: `sudo apt-get install xdotool`
* Write a ./config.json, see `config.example.json`
* Execute `npm start` to start the shell server
* Open Iceweasel on `localhost:8080`
* Set Iceweasel homepage to that url
* Put Iceweasel in fullscreen mode with F11 (persists after reboots)
* `mkdir -p /home/pi/.config/autostart`
* Copy `alarmmonitor.desktop` to the autostart dir and change "Exec" command to `bash -c "cd /home/pi/Alarmmonitor && ./run.sh"`
* Copy Iceweasel desktop file from `/usr/share/applications` to the autostart dir and remove the %u param from the "Exec" command to make Iceweasel load the homepage
