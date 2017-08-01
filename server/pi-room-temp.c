#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

#define PIN 7

#define DHT_MAXCOUNT 32000
#define DHT_PULSES 41





void readd(uint8_t pin){
  pinMode(pin, OUTPUT);
  digitalWrite(pin, LOW);  //Write low for 2 milliseconds
  delay(2);                //pullup resistor writes high until
  pinMode(pin, INPUT);     //sensor responds
  int x;
  for(x=0; x<2000; x++){
    if(digitalRead(pin)==LOW) break;
  }
  int i, j;
  int d_buff[41];
  for(j=0; j < DHT_MAXCOUNT; j++){
    for(int i=1; i<2000; i++){
      if(digitalRead(pin) == HIGH) break;
    }
    for(i=1; i<2000; i++){
      if(digitalRead(pin) == LOW) break;
    }
    d_buff[j] = i;
  }

  uint8_t byte1 = getByte(1, d_buff);
  uint8_t byte2 = getByte(2, d_buff);
  uint8_t byte3 = getByte(3, d_buff);
  uint8_t byte4 = getByte(4, d_buff);
  uint8_t byte5 = getByte(5, d_buff);
  if((byte1+byte2+byte3+byte4) & 0xFF == byte5){
    float humidity = (float) (byte1 << 8 | byte2) / 10.0;
    printf("Humidity= %f \n\r", humidity);
    float temperature;
    int neg = byte3 & 0x80;
    byte3 = byte3 & 0x7F;
    temperature = (float) (byte3 << 8 | byte4) / 10.0;
    if (neg > 0)temperature = -temperature;
    printf("Temperature= %f \n\r", temperature);
    return;
  } else {
    printf("data not good\n");
  }
}

uint8_t getByte(int b, int buff[]){
  int i;
  uint8_t result = 0;
  b = (b-1)*8+1;
  for(i=b; i<=(b+7_;i++){
    result = result <<1;
    result = result | buf[i];
  }
  return result;
}



int dat[5]={0,0,0,0,0};
void read_dat(){
   counter =0;
  int i=0, j=0;
  float f;
  uint8_t laststate = HIGH;
  dat[0]=dat[1]=dat[2]=dat[3]=dat[4]=0;

  pinMode(PIN, OUTPUT);
  digitalWrite(PIN, HIGH);
  delay(250);

  digitalWrite(PIN, LOW); //Send start signal 20ms Low
  delay(20);


  pinMode(PIN, INPUT);
  for(volatile int i=0;i<50; i++){}//Delay before reading

  //wait for DHT to pull low
  uint32_t count = 0;
  for(int x=0;x<200;x++){}
  while(digitalRead(PIN)==HIGH){
    if(++count >= DHT_MAXCOUNT){

    }
  }


  pinMode(PIN, INPUT);   //pin will be input now
  for(i=0; i<85;i++){
    counter=0;                              //Cycle through each
    while(digitalRead(PIN)==laststate){  //change in state
      counter++;                            //description                           Count after loop
      delayMicroseconds(1);                 //Time till sensor changes --             1
      if(counter ==255)                     //Sensor pulls low                        2
        break;                              //Sensor pulls handle_signals             3
    }                                       //Sensor starts transmission with Low     4
    laststate = digitalRead(PIN);        //First bit starts at count 4
    if(counter == 255)                      //Second bit starts 2 after that (low then high)
      break;                                //so every even cycle starting at 4 is high data bit

    if((i>=4) && (i %2 ==0)){
      dat[j/8]=dat[j/8]<< 1                 //Shift data at j/8 byte left by one to accomodate next bit
      if(counter > 16)                      //If its a high bit
        dat[j/8]=dat[j/8] | 1;              //Or with 1 to append bit
        j++;                                //increment bit
    }
  }
  if(j>=40 && dat[4]=((dat[0]+dat[1]+dat[2]+dat[3]) & 0xFF)){
    //good data 40 bits and checkbyte
    f = dat[2]*9./5.+32;
    printf("humidity= %d.%d %% Temperature = %d.%d C\n",
            dat[0],dat[1],dat[2],dat[3]);
  }
}

int main(void){
  wiringPiSetupGpio();
  while(1){
    readd();
    delay(1000);
  }
}
