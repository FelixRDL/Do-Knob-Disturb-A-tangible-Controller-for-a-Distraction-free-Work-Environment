#include "Arduino.h"
#include "KnobDisplay.h"


KnobDisplay::KnobDisplay() {
  KnobDisplay::strip=Adafruit_NeoPixel(KnobDisplay::LED_COUNT, KnobDisplay::NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);
}

void KnobDisplay::animateHueTowards(long targetHue){
  int a = 1;
}

void KnobDisplay::setColor(uint32_t color){
  int a = 1;
}
