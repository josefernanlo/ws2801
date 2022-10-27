import sys
# Import the WS2801 module.
import Adafruit_WS2801
import Adafruit_GPIO.SPI as SPI


# Configure the count of pixels:
PIXEL_COUNT = 100

# The WS2801 library makes use of the BCM pin numbering scheme. See the README.md for details.

# Specify a software SPI connection for Raspberry Pi on the following pins:
PIXEL_CLOCK = 18
PIXEL_DOUT  = 23
pixels = Adafruit_WS2801.WS2801Pixels(PIXEL_COUNT, clk=PIXEL_CLOCK, do=PIXEL_DOUT)


func = sys.argv[1]
val = sys.argv[2]

def power():
    if val :
        for i in range(PIXEL_COUNT):
            pixels.set_pixel_rgb(i, 255, 0, 0)
        pixels.show()
    else :
        for i in range(PIXEL_COUNT):
            pixels.set_pixel_rgb(i, 0, 0, 0)
        pixels.show()
    return val


def brightness ():
    return val

def hue():
    return val

switcher = {
    1: power,
    2: brightness,
    3: hue
}

switcher.get(func, '')()