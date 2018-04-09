# rpi-oled [![NPM Version](https://img.shields.io/npm/v/rpi-oled.svg)](https://www.npmjs.com/package/rpi-oled)
A collection of NodeJS command line tools and libraries for I2C based SSD1306 compatible monochrome OLED screens. The main difference of this library compared to other forks is the added command line tools. Additionally the display performance was increased.

## Installation
These instructions assume you install on Raspberry Pi, the software should however work on most platforms.

### Software
Install NodeJS

`curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -`

`sudo apt install -y nodejs`

Install the needed native i2c libraries

`sudo apt-get install i2c-tools libi2c-dev`

Enable i2c on your Raspberry Pi, the easiest way is using the raspi-config tool

`sudo raspi-config`

Then install the software using:

`sudo npm install -g rpi-oled`

### Hardware
Hook up your I2C compatible OLED display to the Raspberry Pi SDL and SCL pins as well as 3.3V and ground.

### Test the software
Run the following command:

`rpi-oled writeString -t "Hello World"`

This will try to connect to a 128x64 display with address 0x3C on the i2c bus 1, if any of these parameters are not correct for your setup you can change them using the following parameters:

`rpi-oled writeString -t "Hello World" -a 0x3F -b "/dev/i2c-0" -w 64 -h 48`

Valid combinations for screen width and height are: 128x32, 128x64, 96x16 and 64x48.

## Command line tools
The following command line tools will be installed in your system when you install this package: `rpi-oled`, `rpi-oled-status`

### rpi-oled
The `rpi-oled` command line tool can be used to display text and graphics on the OLED from the RasPi command line. All functions of the API can be executed using this tool as well.

The tool works similar to other command line tools like git in that the first parameter of the command is always the command that is to be executed, followed by further parameters. All parameters except the command parameter are always optional.

#### OLED commands
clearDisplay, dimDisplay, invertDisplay, turnOnDisplay, turnOffDisplay, drawPixel, drawLine, fillRect, drawRect, drawBitmap, writeString, startScroll, stopScroll, setCursor

#### Global parameters
- `--width` or `-w` Width of the display in pixel (default `128`)
- `--height` or `-h` Height of the display in pixel (default `64`)
- `--address` or `-a` The OLEDs I2C address (default `0x3C`)
- `--bus` or `-b` The I2C bus to be used (default `"/dev/i2c-1"`)
- `--datasize` The number of bytes to send via I2C in one go (default `16`)
- `--microview` Add this parameter if you're using a microview display (default not enabled)
- `--noclear` or `-n` Do not clear the display before drawing command (default not enabled)

#### Command-specific parameters
- `--size` or `-s` The font size for text (default `1`)
- `--text` or `-t` Text to display (default `""`)
- `--x0` or `-x` X position for drawing (default `0`)
- `--y0` or `-y` Y position for drawing (default `0`)
- `--x1` X1 position for drawing (default `0`)
- `--y1` Y1 position for drawing (default `0`)
- `--raduis` or `-r` Radius for circle (default `10`)
- `--color` or `-c` Color to draw in, 1=white 0=black (default `1`)
- `--font` or `-f` Font name to use (default `"oled-font-5x7"`)
- `--wrapping` Enable wrapping for text display (default not enabled)
- `--linespacing` Line spacing offset for text display (default `0`)
- `--pixels` or `-p` Pixel data to display in array format (no default)
- `--image` or `-i` Path to PNG image to display, will be automatically resized and converted (no default)
- `--disable` or `-d` Disable a boolean parameter (no default)
- `--direction` Direction for scrolling (default `"left"`)
- `--start` Start position for scrolling (default `0`)
- `--stop` Stop position for scrolling (default `0`)
- `--help` or `-?` Display help

#### Examples
`rpi-oled writeString -t "Hello World"`

`rpi-oled writeString -t "New line of text" -y 10 -n`

`rpi-oled drawCircle -x 20 -y 20 -r 10`

### rpi-oled-status
This utility is meant to be run as a service and displays the Raspberry Pi host name as well as bar graphs for its CPU load, memory load and disk load. It also displays the uptime of the Raspberry Pi.

#### Parameters
- `--width` or `-w` Width of the display in pixel (default `128`)
- `--height` or `-h` Height of the display in pixels (default `64`)
- `--address` or `-a` The OLEDs I2C address (default `0x3C`)
- `--bus` or `-b` The I2C bus to be used (default `"/dev/i2c-1"`)
- `--datasize` The number of bytes to send via I2C in one go (default `16`)
- `--microview` Add this parameter if you're using a microview display (default not enabled)
- `--updaterate` or `-u` The update rate for the display in milliseconds (default `5000`)

#### Example
`rpi-oled-status`

`rpi-oled-status -a 0x38`

## API
The main part of the package is the library, the API didn't change much from previous forks of this library, below is an overview of the available methods.

The appropriate parameters for the `rpi-oled` command line tool are listed as well. All parameters except the command parameter are always optional.

### API Example
```javascript
var oled = require('rpi-oled');

var opts = {
  width: 128,
  height: 64,
};

var oled = new oled(opts);

// do cool oled things here
```

Additional options that can be passed, with default values shown:

```javascript
var opts = {
  width: 128, // screen width
  height; 32, // screen height
  address: 0x3C, // Pass I2C address of screen if it is not the default of 0x3C
  datasize: 8, // Change the amount of bytes sent at once (default 16)
  device: '/dev/i2c-1', // Pass your i2c device here if it is not /dev/i2c-1
  microview: true, // set to true if you have a microview display
};
```

### API Overview

#### clearDisplay
Fills the buffer with 'off' pixels (0x00). Optional bool argument specifies whether screen updates immediately with result. Default is true.

Usage:
```javascript
oled.clearDisplay();
```
Command line:

`rpi-oled clearDisplay`

#### dimDisplay
Lowers the contrast on the display. This method takes one argument, a boolean. True for dimming, false to restore normal contrast.

Usage:
```javascript
oled.dimDisplay(true|false);
```
Command line:

`rpi-oled dimDisplay` or `rpi-oled dimDisplay -d` to disable dimming

#### invertDisplay
Inverts the pixels on the display. Black becomes white, white becomes black. This method takes one argument, a boolean. True for inverted state, false to restore normal pixel colors.

Usage:
```javascript
oled.invertDisplay(true|false);
```
Command line:

`rpi-oled invertDisplay` or `rpi-oled invertDisplay -d` to disable dimming

#### turnOffDisplay
Turns the display off.

Usage:
```javascript
oled.turnOffDisplay();
```
Command line:

`rpi-oled turnOffDisplay`

#### turnOnDisplay
Turns the display on.

Usage:
```javascript
oled.turnOnDisplay();
```
Command line:

`rpi-oled turnOnDisplay`


#### drawPixel
Draws a pixel at a specified position on the display. This method takes one argument: a multi-dimensional array containing either one or more sets of pixels.

Each pixel needs an x position, a y position, and a color. Colors can be specified as either 0 for 'off' or black, and 1 or 255 for 'on' or white.

Optional bool as last argument specifies whether screen updates immediately with result. Default is true.

Usage:
```javascript
// draws 4 white pixels total
// format: [x, y, color]
oled.drawPixel([
	[128, 1, 1],
	[128, 32, 1],
	[128, 16, 1],
	[64, 16, 1]
]);
```
Command line:

`rpi-oled drawPixel -p "[[128, 1, 1],[128, 32, 1],[128, 16, 1],[64, 16, 1]]"`

#### drawLine
Draws a one pixel wide line.

Arguments:
+ int **x0, y0** - start location of line
+ int **x1, y1** - end location of line
+ int **color** - can be specified as either 0 for 'off' or black, and 1 or 255 for 'on' or white.

Optional bool as last argument specifies whether screen updates immediately with result. Default is true.

Usage:
```javascript
// args: (x0, y0, x1, y1, color)
oled.drawLine(1, 1, 128, 32, 1);
```
Command line:

`rpi-oled drawline --x0 1 --y0 1 --x1 128 --y1 32 -c 1`

#### fillRect
Draws a filled rectangle.

Arguments:
+ int **x0, y0** - top left corner of rectangle
+ int **x1, y1** - bottom right corner of rectangle
+ int **color** - can be specified as either 0 for 'off' or black, and 1 or 255 for 'on' or white.

Optional bool as last argument specifies whether screen updates immediately with result. Default is true.

Usage:
```javascript
// args: (x0, y0, x1, y1, color)
oled.fillRect(1, 1, 10, 20, 1);
```
Command line:

`rpi-oled fillRect --x0 1 --y0 1 --x1 10 --y1 20 -c 1`

#### drawRect
Draws an empty rectangle.

Arguments:
+ int **x0, y0** - top left corner of rectangle
+ int **x1, y1** - bottom right corner of rectangle
+ int **color** - can be specified as either 0 for 'off' or black, and 1 or 255 for 'on' or white.

Optional bool as last argument specifies whether screen updates immediately with result. Default is true.

Usage:
```javascript
// args: (x0, y0, x1, y1, color)
oled.drawRect(1, 1, 10, 20, 1);
```
Command line:

`rpi-oled drawRect --x0 1 --y0 1 --x1 10 --y1 20 -c 1`

#### drawCircle
Draws an empty circle.

Arguments:
+ int **x** - x of circle's center
+ int **y** - y of circle's center
+ int **r** - radius of circle
+ int **color** - can be specified as either 0 for 'off' or black, and 1 or 255 for 'on' or white.

Optional bool as last argument specifies whether screen updates immediately with result. Default is true.

Usage:
```javascript
// args: (x, y, r, color)
oled.drawCircle(30, 10, 5, 1);
```
Command line:

`rpi-oled drawCircle -x 30 -y 10 -r 5 -c 1`


#### drawBitmap
Draws a bitmap using raw pixel data returned from an image parser. The image sourced must be monochrome, and indexed to only 2 colors. Resize the bitmap to your screen dimensions first. Using an image editor or ImageMagick might be required.

Optional bool as last argument specifies whether screen updates immediately with result. Default is true.

Tip: use a NodeJS image parser to get the pixel data, such as [pngparse](https://www.npmjs.org/package/pngparse). A demonstration of using this is below.


Example usage:
```
npm install pngparse
```

```javascript
var pngparse = require('pngparse');

pngparse.parseFile('indexed_file.png', function(err, image) {
	oled.drawBitmap(image.data);
});
```

This method is provided as a primitive convenience. A better way to display images is to use NodeJS package [png-to-lcd](https://www.npmjs.org/package/png-to-lcd) instead. It's just as easy to use as drawBitmap, but is compatible with all image depths (lazy is good!). It will also auto-dither if you choose. You should still resize your image to your screen dimensions. This alternative method is covered below:

```
npm install png-to-lcd
```

```javascript
var pngtolcd = require('png-to-lcd');

pngtolcd('nyan-cat.png', true, function(err, bitmap) {
  oled.buffer = bitmap;
  oled.update();
});
```
Command line:

`rpi-oled drawBitmap -i "./path/to/image.png"`

#### startScroll
Scrolls the current display either left or right.
Arguments:
+ string **direction** - direction of scrolling. 'left' or 'right'
+ int **start** - starting row of scrolling area
+ int **stop** - end row of scrolling area

Usage:
```javascript
// args: (direction, start, stop)
oled.startscroll('left', 0, 15); // this will scroll an entire 128 x 32 screen
```
Command line:

`rpi-oled startScroll --direction left --start 0 --stop 15`

#### stopScroll
Stops all current scrolling behaviour.

Usage:
```javascript
oled.stopscroll();
```
Command line:

`rpi-oled stopScroll`

#### setCursor
Sets the x and y position of 'cursor', when about to write text. This effectively helps tell the display where to start typing when writeString() method is called.

Call setCursor just before writeString().

Usage:
```javascript
// sets cursor to x = 1, y = 1
oled.setCursor(1, 1);
```
Command line:

`rpi-oled setCursor -x 1 -y 1`

#### writeString
Writes a string of text to the display.
Call setCursor() just before, if you need to set starting text position.

Arguments:
+ obj **font** - font object in JSON format (see note below on sourcing a font)
+ int **size** - font size, as multiplier. Eg. 2 would double size, 3 would triple etc.
+ string **text** - the actual text you want to show on the display.
+ int **color** - color of text. Can be specified as either 0 for 'off' or black, and 1 or 255 for 'on' or white.
+ bool **wrapping** - true applies word wrapping at the screen limit, false for no wrapping. If a long string without spaces is supplied as the text, just letter wrapping will apply instead.
+ int **linespacing** - amount of spacing between lines of text on the screen. Negative numbers are also ok.

Optional bool as last argument specifies whether screen updates immediately with result. Default is true.

Before all of this text can happen, you need to load a font buffer for use. A good font to start with is NodeJS package [oled-font-5x7](https://www.npmjs.org/package/oled-font-5x7).

Usage:
```
npm install oled-font-5x7
```

```javascript
var font = require('oled-font-5x7');

// sets cursor to x = 1, y = 1
oled.setCursor(1, 1);
oled.writeString(font, 1, 'Cats and dogs are really cool animals, you know.', 1, true);
```
Command line:

`rpi-oled writeString -f "oled-font-5x7" -s 1 -t "Hello World" -c 1 --wrapping --linespacing 3 -x 1 -y 1`

Note that the rpi-oled tool allows you to combine the setCursor and writeString command by simply supplying x and y parameters.

#### update
Sends the entire buffer in its current state to the oled display, effectively syncing the two. This method generally does not need to be called, unless you're messing around with the framebuffer manually before you're ready to sync with the display. It's also needed if you're choosing not to draw on the screen immediately with the built in methods.

Usage:
```javascript
oled.update();
```
Command line:

`No equivalent`
