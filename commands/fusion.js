const fs = require('fs');

exports.run = (bot,message,args) => {
    var length = "";
    const pokemon = require('./pokemon-scraper.js');
    
    var path = "";
    var stats = fs.statSync("./images/pokemon/index.txt");
    
    if((stats["size"]) == 0){
        pokemon.run();
        return message.channel.send("This command... Are you sure :eyes:", {file: "./images/pokemon/0-0/power.gif"});
    }

    if(!args[0]){

        pokemon.run();
        fs.readFile("./images/pokemon/index.txt", function read(err, data){
            if(err){
                throw err;
            }
            else {
                path = "." + data.toString('utf8').trim();
                
                //let path = path.replace(/.json+$/,'.png');
                
                const config = require(path);
                let name = config.pokemon[0].name
                let img = config.pokemon[0].img

                return message.channel.send(message.author + " i created a " + name + " for you!", {file: img})

            }
        })
    }
}
