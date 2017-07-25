#include <stdio.h>
#include <strings.h>
#include <wiringpi.h>
//handlePi
//usage:
//  handle [-fade] [-fast] [-solid red green blue] [-off]
int redPin=0, greenPin=0, bluePin=0;
int main(int argc, char *args[]){
  File *pins = fopen('/home/pins.txt', 'r');
  char buffer[255];
  redPin = atoi(fscanf(pins, "%s", buffer));
  greenPin = atoi(fscanf(pins, "%s", buffer));
  bluePin = atoi(fscanf(pins, "%s", buffer));
  if(argc<2){
    printf("Usage: handle [-fade] [-fast] [-solid (red) (green) (blue)] [-off]");
    return 1;
  }
  if(strcasecmp(args[1],"-fade")){
    doFade();
  } else if(strcasecmp(args[1],"-fast")){
    doFast();
  } else if(strcasecmp(args[1],"-off")){
    doTurnOff();
  } else if(strcasecmp(args[1],"-solid")){
    if(argc<5){
      printf("Usage: handle -solid (red) (green) (blue)")
    }
    int red = atoi(args[2]);
    int green = atoi(args[3]);
    int blue = atoi(args[3]);
    doSolid(red, green, blue);
  } else {
    printf("Usage: handle [-fade] [-fast] [-solid (red) (green) (blue)] [-off]");
    return 1;
  }
  return 0;
}

static void doFade(){
  File
}
