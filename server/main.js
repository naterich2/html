const http= require('http');
const qs=   require('querystring');
const exec= require('child_process').exec;

const port = 3000;
const hostname = '127.0.0.1';

const reqHandler = (request, response) => {
  var colors='';
  if(request.method=='POST'){
    var body= '';
    request.on('data', function(data){
      body += data;
      if(body.length > 1000){
        request.connection.destroy();
      }
    });
    request.on('end', function(){
      try{
        colors=JSON.parse(body);
        console.log(colors);
      } catch(e){
        console.log(e);
      }
    });

  }

}


const srv = http.createServer(reqHandler);

srv.listen(port, hostname => {
  console.log("server listenin on 3000 localhost");
});
