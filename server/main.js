const http= require('http');
const qs=   require('querystring');
const exec= require('child_process').exec;

const port = 3000;
const hostname = '127.0.0.1';

const reqHandler = (request, response) => {

  if(request.method=='POST'){
    var colors='';
    var body= '';
    request.on('data', function(data){
      body += data;
      if(body.length > 1000){
        request.connection.destroy();
      }
    });
    request.on('end', function(){
      colors=JSON.parse(body);

    });
    console.log(colors);
  }

}


const srv = http.createServer(reqHandler);

srv.listen(port, hostname => {
  console.log("server listenin on 3000 localhost");
});
