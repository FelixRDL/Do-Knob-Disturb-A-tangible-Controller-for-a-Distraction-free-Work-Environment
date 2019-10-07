/**
 * Rotary Encoder Code taken from: 
 * https://www.best-microcontroller-projects.com/rotary-encoder.html
 */

#include <Adafruit_NeoPixel.h>

#define ENCODER_CLK_PIN  5
#define ENCODER_DATA_PIN 4

#define NEOPIXEL_PIN 2

#define YLED 15
#define NEOPIXEL_LED_COUNT  60
#define NEOPIXEL_ANIMATION_STEPSIZE  25
#define NEOPIXEL_ANIMATION_NUM_STEPS  75
#define NEOPIXEL_BRIGHTNESS 140


#define HUE_HIGH_FOCUS 0
#define HUE_MEDIUM_FOCUS 6922
#define HUE_LOW_FOCUS 21845

#define SERIAL_BAUDRATE 9600

#define MAX_FOCUS_LEVEL 2

long neopixel_currHue = 21845;
Adafruit_NeoPixel neopixel_strip(NEOPIXEL_LED_COUNT, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ400);
static uint16_t encoder_state=0;

bool serial_is_connected = false;
bool serial_blink_lastState = false;
String serial_handshakecode = "hi_there\n";

int curr_focusLevel = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////
void setup() {
  initPins();
  initDisplay();
  initSerial();
  animateHueTowards(neopixel_currHue);
}

void initSerial() {
  Serial.begin(SERIAL_BAUDRATE);
  Serial.println("");
  serial_printMsg("device_activated", 1);
}

void initPins() {
   pinMode(ENCODER_CLK_PIN,INPUT);
   pinMode(ENCODER_DATA_PIN,INPUT);
   pinMode(YLED,OUTPUT);
}

void initDisplay() {
  neopixel_strip.begin();
  neopixel_strip.show();
  neopixel_strip.setBrightness(NEOPIXEL_BRIGHTNESS);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
void loop() {
      int val = readEncoder();
      if(val != 0) {
        if(val > 0) {
          decreaseFocusLevel();
        } else {
          increaseFocusLevel();
        }
      }
}

// serial if
//
//
void serial_printMsg(String type, int value) {
  Serial.print(type);
  Serial.print(";");
  Serial.print(value, DEC);
  Serial.print("\n");
}

// focus level control
//
//

void decreaseFocusLevel(){
  if(curr_focusLevel > 0) {
    curr_focusLevel --;
    setCurrFocusLevel(curr_focusLevel);
  } else {
    serial_printMsg("tried_underturn", -1);
  }
}

void increaseFocusLevel() {
  if(curr_focusLevel < MAX_FOCUS_LEVEL) {
    curr_focusLevel ++;
    setCurrFocusLevel(curr_focusLevel);
  } else {
      serial_printMsg("tried_overturn", -1);
  }
}

void setCurrFocusLevel(int focus) {
  curr_focusLevel = focus;
  serial_printMsg("set_status", focus);
  delay(100);
  animateHueTowards(getTargetHueForFocusLevel(focus));
  delay(100);
}

// color and animation functions
//
//

long getTargetHueForFocusLevel(int focus) {
  if(focus == 0) {
    return HUE_LOW_FOCUS;
  } else if(focus == 1) {
    return HUE_MEDIUM_FOCUS;
  } else if(curr_focusLevel == 2) {
    return HUE_HIGH_FOCUS;
  }
}

void animateHueTowards(long targetHue) {
  int numSteps = NEOPIXEL_ANIMATION_NUM_STEPS;
  int stepSize = (targetHue - neopixel_currHue)/numSteps;
  for(int i = 0; i < numSteps; i++) {
    neopixel_currHue += stepSize;
    setColor(neopixel_strip.ColorHSV(neopixel_currHue, 255, 255));
    delay(1);
  }
}

void setColor(uint32_t color) {
  for(int i=0; i<neopixel_strip.numPixels(); i++) { // For each pixel in neopixel_strip...
    neopixel_strip.setPixelColor(i, color);         //  Set pixel's color (in RAM)
  }
  neopixel_strip.show();
}

// encoder functions
//
//
int readEncoder() {
    encoder_state=(encoder_state<<1) | digitalRead(ENCODER_CLK_PIN) | 0xe000;
    if (encoder_state==0xf000){
       encoder_state=0x0000;
       if(digitalRead(ENCODER_DATA_PIN)){
         return 1;
       }
       else{
         return -1;
       }
    } else {
      return 0;
    }
}
