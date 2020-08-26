const fs = require("fs")

if (!fs.existsSync("topics.json")) {

          fs.writeFile('topics.json', "{\"greatest\":0}", function(){})
          console.log("Initialised essential files. Please run again to use.")
          return;

}

const topics = require("./topics.json")

var args = process.argv.slice(" ");

switch (args[2]){
        case "help":
                console.log("<Available Commands>\n\nadd [topic name]: add a topic\nremove [topic name]: remove a topic")
                return;
        case "add":
                if (!args[3]) return console.log("No topic name specified!")
                let topicName = args[3]
                let i = 4
                while(args[i]){
                        topicName = topicName + " " + args[i]
                        i++

                }
                next = topics.greatest
                topics.greatest = topics.greatest+1

                topics[next] = topicName

                console.log(topics[next].date)

                console.log(JSON.stringify(topics))
                
                fs.writeFile(`topics.json`, JSON.stringify(topics), function () {});
                console.log(`Added \"${topicName}\" to your list of topics. You will next be prompted to revise it in`)
                return;
        case "remove":
                return;
        default:
                console.log("This doesn't appear to be a valid command. Use [executable] help for more information")
                return;
}