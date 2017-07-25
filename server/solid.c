#include <wiringpi.h>

#define RED =   //Insert pin numbers later
#define GREEN =
#define BLUE =
int main(int argc, char *args[]){
  wiringPiSetupGpio();  //initialize pins
  if(argc<3){           //check for RGB format
    printf("--Solid[FATAL]: format ./solid red green blue");
    exit(1);
  }
  int red =   args[0];
  int green = args[1];
  int blue =  args[2];

  digitalWrite
}
