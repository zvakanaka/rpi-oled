#!/usr/bin/env node
var oled = require('./oled.js');
const commandLineArgs = require('command-line-args')
const mainDefinitions = [
  { name: 'command', defaultOption: true }
]
const optionDefinitions = [
  { name: 'width', alias: 'w', type: Number },
  { name: 'height', alias: 'h', type: Number },
  { name: 'address', alias: 'a', type: Number },
  { name: 'bus', alias: 'b', type: String },
  { name: 'microview', type: Boolean },
  { name: 'datasize', type: Number },
  { name: 'noclear', alias: 'n', type: Boolean },

  { name: 'size', alias: 's', type: Number },
  { name: 'text', alias: 't', type: String },
  { name: 'x0', alias: 'x', type: Number },
  { name: 'y0', alias: 'y', type: Number },
  { name: 'x1', type: Number },
  { name: 'y1', type: Number },
  { name: 'radius', alias: 'r', type: Number },
  { name: 'color', alias: 'c', type: Number },
  { name: 'font', alias: 'f', type: Number },
  { name: 'wrapping', type: Boolean},
  { name: 'linespacing', type: Number},
  { name: 'pixels', alias: 'p', type: String },
  { name: 'image', alias: 'i', type: String },
  { name: 'disable', alias: 'd', type: Boolean },
  { name: 'direction', type: String },
  { name: 'start', type: Number },
  { name: 'stop', type: Number },

  { name: 'help', alias: '?', type: Number }
]

const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true })
const argv = mainOptions._unknown || []
const options = commandLineArgs(optionDefinitions, { argv })


var opts = {
  width: options.width || 128,
  height: options.height || 64,
  address: options.address || 0x3C, // Pass I2C address of screen if it is not the default of 0x3C
  device: options.bus || '/dev/i2c-1', // Pass your i2c device here if it is not /dev/i2c-1
  microview: options.microview, // set to true if you have a microview display
  datasize: options.datasize || 16
};

var oled = new oled(opts);
//oled.turnOnDisplay();
let x0 = options.x0 || 0;
let y0 = options.y0 || 0;
let x1 = options.x1 || 0;
let y1 = options.y1 || 0;
let radius = options.radius || 10;
let text = options.text || "";
let color = options.color || 1;
let size = options.size || 1;
let fontName = options.font || 'oled-font-5x7';
let imageName = options.image;
let disable = !options.disable;
let direction = options.direction || 'left';
let start = options.start || 0;
let stop = options.stop || 0;
let wrapping = options.wrapping;
let linespacing = options.linespacing || 0;

if(!options.noclear){
  oled.clearDisplay();
  oled.update();
}
switch(mainOptions.command) {
  case 'clearDisplay':
    oled.clearDisplay();
    oled.update();
    break;
  case 'writeString':
    var font = require(fontName);
    if(options.x0 && options.y0){
      oled.setCursor(options.x0, options.y0);
    }
    oled.writeString(font, size, text, color, wrapping, linespacing);
    break;
  case 'dimDisplay':
    oled.dimDisplay(!disable);
    break;
  case 'invertDisplay':
    oled.invertDisplay(!disable);
    break;
  case 'turnOnDisplay':
    oled.turnOnDisplay();
    break;
  case 'turnOffDisplay':
    oled.turnOnDisplay();
    break;
  case 'drawPixel':
    if(!options.pixels){
      console.log("Please specify pixel data in array format");
      break;
    }
    let pixels = JSON.parse(options.pixels);
    oled.drawPixel(pixels)
    break;
  case 'drawLine':
    oled.drawLine(x0,y0,x1,y1,color);
    break;
  case 'fillRect':
    oled.fillRect(x0,y0,x1,y1,color);
    break;
  case 'drawRect':
    oled.drawRect(x0,y0,x1,y1,color);
    break;
  case 'drawCircle':
    oled.drawCircle(x0,y0,radius,color);
    break;
  case 'drawBitmap':
    if(!imageName) break;
    var pngtolcd = require('png-to-lcd');
    pngtolcd(imageName, true, function(err, bitmap) {
      oled.buffer = bitmap;
      oled.update();
    });
    break;
  case 'startScroll':
    oled.startScroll(direction, start, stop);
    break;
  case 'stopScroll':
    oled.stopScroll();
    break;
  case 'setCursor':
    oled.setCursor(x0,y0);
    break;
  default:
}
