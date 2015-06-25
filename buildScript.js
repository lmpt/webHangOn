var modConcat = require("node-module-concat");
var outputFile = "./gameJsBuild/game.js";
modConcat("./src/main.js", outputFile, function(err, files) {
  if(err) throw err;
  console.log(files.length + " were combined into " + outputFile);
});