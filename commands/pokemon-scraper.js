const rp = require('request-promise'); //Also install request
const cheerio = require('cheerio'); //Basic webscraper for static sites
const Scraper = require('image-scraper'); //webscraper to pull images only
const fs = require('fs');

exports.run = (bot,message) => {

    var pk1 = Math.floor(Math.random() * 150) + 1;
    var pk2 = Math.floor(Math.random() * 150) + 1;

    var url = 'http://pokemon.alexonsager.net/' + pk1 + '/' + pk2;
    var printPath = "";
    const options = {
        url: url,
        transform:body => cheerio.load(body)
    }

    rp(options)
    .then(($) => {

        //process.stdout.write('Generating a new pokemon...\n');
        let name1 = $("option[value='" + pk1 + "']").html().trim()
        let name2 = $("option[value='" + pk2 + "']").html().trim()
        let name = $('#pk_name').html().trim()
        let fuse = $("#pk_img").attr('src');
        let dir = './images/pokemon/';
        let path = dir + pk1 + "-" + pk2;
        
        let scraper = new Scraper(url);
        printPath = path + "/" + name + ".png";
        scraper.scrape(function(image){
            let id = image.attributes.id
            if(id != undefined){
                if(id == "pk_img"){
                    
                    if(!fs.existsSync(path)){
                        fs.mkdirSync(path)
                        
                        image.saveTo = path  + "/"
                        image.name = name;
                        image.save(); //Turn off if you do not wish to save the image
                        
                        let data = pokeData(url,pk1 + "." + pk2,name,name1,name2,fuse); 

                        fs.appendFile(path + "/" + name + ".json", data, function(err){
                            if(err) throw err;
                            /*
                            Check to see if json file has been saved
                            console.log('Saved');
                            */
                        })
                        
                        fs.writeFileSync(dir + "index.txt", "\n" + path + "/" + name + ".json", function(err){
                            if(err) throw err;
                            /*
                            Check to see if index file has been saved/updated
                            console.log('Saved');
                            */
                        })
                    } else {
                        return;
                    }
                    /* Print out how many pokemon fusions have been generated so far
                    fs.readdir(dir,(err,files) => {
                        console.log(files.length)
                    })
                    */
                }
            }
        })
    })
    .catch((err) => {
        //console.log(err)
        return message.channel.send("Oops, it appears I ran out of stardust! Contact Professor Paw so he can fix this!");
    })
    .finally(function(){
        //console.log("\nGods Plan")
        return printPath;

    })
}
function pokeData(url,id, name,poke1,poke2,img){
    let header = "{"
    let footer = "}"
    
    let dataStart = header + '\n    \"pokemon\": \n    [\n\t{\n';

    id = "\t    \"id\": \"" + id + "\",\n";
    url = "\t    \"url\": \"" + url + "\",\n";
    img = "\t    \"img\": \"" + img + "\",\n";
    name = "\t    \"name\": \"" + name + "\",\n";
    poke1 = "\t    \"pokemon1\": \"" + poke1 + "\",\n";
    poke2 = "\t    \"pokemon2\": \"" + poke2 + "\",\n"; 
    let data = (url + img + id + name + poke1 + poke2).replace(/,\n+$/,'');

    let dataEnd = '\n\t}\n    ]\n' + footer;
    data = dataStart + data + dataEnd;
    
    return data;
}