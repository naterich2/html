$(function() {  //Run on load
  $("#red, #green, #blue").slider({
    orientation: "horizontal",
    range: "min",
    max: 255,
    value: 127,
    slide: refreshSwatch,     //only update swatch when moving, update
    change: update            //server when done
  });
  $("#red").slider("value", 255);
  $("#green").slider("value", 140);
  $("#blue").slider("value", 60);
});

//------------------------Slider functions-----------------------------------
function hexFromRGB(r, g, b) {
  var hex = [
    r.toString(16),
    g.toString(16),
    b.toString(16)
  ];
  $.each(hex, function(nr, val){
    if (val.length === 1){
      hex[nr] = "0" + val;
    }
  });
  return hex.join("").toUpperCase();
}
function refreshSwatch() {
  var red = $("#red").slider("value"),
      green = $("#green").slider("value"),
      blue = $("#blue").slider("value"),
      hex = hexFromRGB(red, green, blue);
  $("#swatch").css("background-color", "#" + hex);
}
function update(){
  //Leftover from refreshSwatch
  var red = $("#red").slider("value"),
      green = $("#green").slider("value"),
      blue = $("#blue").slider("value"),
      hex = hexFromRGB(red, green, blue);
  $("#swatch").css("background-color", "#" + hex);
  var color={'led':{'red': red, 'green': green, 'blue': blue}};
  color = JSON.stringify(color);
  console.log(color);             //send color to node.js server
  $.ajax({
    url:"http://127.0.0.1:3000",
    type: "POST",
    dataType:"json",
    data:color
  });
}
//-------------------------Button functions---------------------------------
