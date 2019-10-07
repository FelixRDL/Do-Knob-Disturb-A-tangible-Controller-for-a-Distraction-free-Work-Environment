#include "Arduino.h"

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
 #include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif


#ifndef KnobDisplay_h
#define KnobDisplay_h

class KnobDisplay
{
  public:
    KnobDisplay();
    void animateHueTowards(long targetHue);
  private:
    void setColor(uint32_t color);
    const int LED_COUNT = 60;
    const int ANIMATION_STEP_COUNT = 5;
    const int NEOPIXEL_PIN = 0;
    Adafruit_NeoPixel strip;
};
#endif
