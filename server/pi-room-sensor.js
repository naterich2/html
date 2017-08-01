const sensor = require('rpi-dht-sensor'),
      Influx = require('influx');

const client = new Influx.InfluxDB({
  database: 'local_temp',
  host: 'loaclhost',
  port: 8086,
  username: 'pi',
  password: 'piuser',
  schema: [
    {
      measurement: 'dht11',
      fields: {
        temperature:  Influx.FieldType.FLOAT,
        humidity:     Influx.FieldType.FLOAT
      }
    }
    tags: [
      'pi'
    ]
  ]
});

var dht = new sensor.DHT11(7);
var read = function(){
  var humidity_dat = dht.read().humidity.toFixed(1);
  var temperature_dat = dht.read().temperature.toFixed(1);
  Influx.writePoints([
    {
      measurement: 'dht11',
      tags: 'pi',
      fields: {
        temperature:  temperature_dat,
        humidity:     humidity_dat
      }
    }
  ]);
}

setTimeout(read, 300000);
