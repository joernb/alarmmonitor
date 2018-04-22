#!/usr/bin/python
import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM) # Zaehlweise der GPIO Pins auf dem Raspberry
GPIO.setup(2, GPIO.IN) # Pin 3 als Eingang - Button 1
GPIO.setup(3, GPIO.IN) # Pin 4 als Eingang - Button 2

# store button state in these variables, 0 means button is pressed
button1 = 1
button2 = 1

while True:
	if (GPIO.input(2) == 0 and button1 != 0): 
		print("button1")
		button1 = 0
		time.sleep(0.3);

	if (GPIO.input(3) == 0 and button2 != 0): 
		print("button2")
		button2 = 0
		time.sleep(0.3);

	button1 = GPIO.input(2)
	button2 = GPIO.input(2)
