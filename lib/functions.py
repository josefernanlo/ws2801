import Adafruit_GPIO.SPI as SPI
import Adafruit_WS2801
import RPi.GPIO as GPIO
import time
import sys

Python
# Simple demo of of the WS2801/SPI-like addressable RGB LED lights.

# Import the WS2801 module.


# Configure the count of pixels:
PIXEL_COUNT = 100

# The WS2801 library makes use of the BCM pin numbering scheme. See the README.md for details.

# Specify a software SPI connection for Raspberry Pi on the following pins:
SPI_PORT = 0
SPI_DEVICE = 0
pixels = Adafruit_WS2801.WS2801Pixels(
    PIXEL_COUNT, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE), gpio=GPIO)


func = sys.argv[1]
val = True

# Define the wheel function to interpolate between different hues.


def wheel(pos):
    if pos < 85:
        return Adafruit_WS2801.RGB_to_color(pos * 3, 255 - pos * 3, 0)
    elif pos < 170:
        pos -= 85
        return Adafruit_WS2801.RGB_to_color(255 - pos * 3, 0, pos * 3)
    else:
        pos -= 170
        return Adafruit_WS2801.RGB_to_color(0, pos * 3, 255 - pos * 3)


def appear_from_back(pixels, color=(255, 0, 0)):
    pos = 0
    for i in range(pixels.count()):
        for j in reversed(range(i, pixels.count())):
            pixels.clear()
            # first set all pixels at the begin
            for k in range(i):
                pixels.set_pixel(k, Adafruit_WS2801.RGB_to_color(
                    color[0], color[1], color[2]))
            # set then the pixel at position j
            pixels.set_pixel(j, Adafruit_WS2801.RGB_to_color(
                color[0], color[1], color[2]))
            pixels.show()
            time.sleep(0.02)


def brightness_decrease(pixels, wait=0.01, step=1):
    for j in range(int(256 // step)):
        for i in range(pixels.count()):
            r, g, b = pixels.get_pixel_rgb(i)
            r = int(max(0, r - step))
            g = int(max(0, g - step))
            b = int(max(0, b - step))
            pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(r, g, b))
        pixels.show()
        if wait > 0:
            time.sleep(wait)


def power():
    if val:
        appear_from_back(pixels)
    else:
        brightness_decrease(pixels)
    return val


def brightness():
    return val


def hue():
    return val


power()
