const http= require('http');
const qs=   require('querystring');
const exec= require('child_process').exec;

const port = 3000;
const hostname = '127.0.0.1';

const reqHandler = (request, response) => {

  if(request.method=='POST'){
    var body= '';
    request.on('data', function(data){
      body += data;
      if(body.length > 1000){
        request.connection.destroy();
      }
    });
    request.on('end', function(){
      handleRequest(body);
      //colors=JSON.parse(body);
    //  console.log(colors);
      //exec('gpio pwm ${redPin} ${colors.led.red}');
      //exec('gpio pwm ${greenPin} ${colors.led.green}');
      //exec('gpio pwm ${bluePin} ${colors.led.blue}');
    });
  }
}

handleRequest=function(data){
  var colors;
  if(data.toString() === 'fade'){

  } else if(data.toString() === 'fast') {

  } else if(data.toString() === 'solid') {

  } else if(data.toString() === 'off') {

  } else {
    try{
      colors = JSON.parse(data);
      console.log(colors.led);
    } catch(e){
      console.log("Cannot interpret request");
    }
  }
}


const srv = http.createServer(reqHandler);

srv.listen(port, hostname => {
  console.log("server listenin on 3000 localhost");
});
