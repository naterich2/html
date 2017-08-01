#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

#define PIN 7

#define DHT_MAXCOUNT 32000
#define DHT_PULSES 41

int dat[5]={0,0,0,0,0};

void read_dat(){
  int counter = 0;
  int i=0, j=0;
  float f=0;
  uint8_t laststate = HIGH;
  dat[0] = dat[1] = dat[2] = dat[3] = dat[4] = 0;

  pinMode(PIN, OUTPUT);
  digitalWrite(PIN, HIGH);
  delay(250);

  digitalWrite(PIN, LOW); //Send start signal 20ms Low
  delay(20);

  digitalWrite(PIN, HIGH);
  delayMicroseconds(40);

  pinMode(PIN, INPUT);   //pin will be input now
  for(i = 0; i < 85;i++){
    counter = 0;                              //Cycle through each
    while(digitalRead(PIN) == laststate){  //change in state
      counter++;                              //description                           Count after loop
      delayMicroseconds(1);                   //Time till sensor changes --             1
      if(counter == 255)                      //Sensor pulls low                        2
        break;                                //Sensor pulls handle_signals             3
    }                                         //Sensor starts transmission with Low     4
    laststate = digitalRead(PIN);        //First bit starts at count 4
    if(counter == 255)                      //Second bit starts 2 after that (low then high)
      break;                                //so every even cycle starting at 4 is high data bit

    if((i >= 4) && (i % 2 == 0)){
      dat[j/8] = dat[j/8] << 1;                //Shift data at j/8 byte left by one to accomodate next bit
      if(counter > 16)                      //If its a high bit
        dat[j/8] = dat[j/8] | 1;              //Or with 1 to append bit
        j++;                                //increment bit
    }
  }
  if(j >= 40 && dat[4]==((dat[0]+dat[1]+dat[2]+dat[3]) & 0xFF)){
    //good data 40 bits and checkbyte
    f = dat[2]*9./5.+32;
    printf("humidity= %d.%d %% Temperature = %d.%d C\n",
            dat[0],dat[1],dat[2],dat[3]);
  } else {
    printf("Data not good, skipping: %i %i %i %i %i\n",dat[0],dat[1],dat[2],dat[3],dat[4]);
  }
}

int main(void){
  wiringPiSetupGpio();
  while(1){
    read_dat();
    delay(1000);
  }
  return 0;
}
