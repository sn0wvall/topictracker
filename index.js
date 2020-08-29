const fs = require("fs")

if (!fs.existsSync("topics.json")) {

          fs.writeFile('topics.json', "{\"greatest\":0}", function(){})
          console.log("Initialised essential files. Please run again to use.")
          return;

}

const topics = require("./topics.json")

var args = process.argv.slice(" ");

function checkTopics(){
        let i = 0
        topicsToReview = ""
        while (i < topics.greatest){
                if (topics[i].dateNext < new Date().getTime() ){
                        topicsToReview = topicsToReview + "\n" + (i+1) + ": " + topics[i].name 
                }
                i++ 
        }
        if (!topicsToReview) topicsToReview = "\nNo topics to review"

        console.log("Topics to Review:\n" + topicsToReview + "\n\nUse \"[executable] review [number]\" to indicate the topic has been reviewed")
}

if (!args[2]){
        checkTopics()
        return;
}

switch (args[2]){
        case "reset":
                console.log("Resetting tasks.")
                fs.writeFile('topics.json', "{\"greatest\":0}", function(){})
                return;
        case "help":
                console.log("<Available Commands>\n\nadd [topic name]: add a topic\nclear [number]: review a topic\nreset: remove all topics\nstat [number]: view info about a topic")
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

                topics[next] = {}
                topics[next].name = topicName
                topics[next].dateAdded = new Date().getTime();
                topics[next].dateNext = topics[next].dateAdded + (24 * 60 * 60 * 1000);
                topics[next].repetitions = 0

                // First repetition: 1 day
                // Second repetition: 7 days
                // Third repetition: 16 days
                // Fourth repetition: 35 days
                
                fs.writeFile(`topics.json`, JSON.stringify(topics, null, 2), function () {});
                console.log(`Added \"${topicName}\" to your list of topics. You will next be prompted to revise it in`)
                return;
        case "review":

                if (!args[3]) return console.log("No topic number specified!")

                usableIndex = args[3] - 1

                switch(topics[usableIndex].repetitions) {
                        case 0:
                                updatedDate = topics[usableIndex].dateAdded + (168 * 60 * 60 * 1000);
                                break;
                        case 1:
                                updatedDate = topics[usableIndex].dateAdded + (384 * 60 * 60 * 1000);
                                break;
                        default:
                                updatedDate = topics[usableIndex].dateNext + (840 * 60 * 60 * 1000);
                                break;
                }

                topics[usableIndex].repetitions++

                topics[usableIndex].dateNext = updatedDate

                fs.writeFile(`topics.json`, JSON.stringify(topics, null, 2), function () {});

                console.log(`Reviewed ${topics[usableIndex].name}. You will next be reminded to review this on ${new Date(topics[usableIndex].dateNext)}`)

                return;
        case "check":
                checkTopics()
                return;
        case "stat":

                if (!args[3]) return console.log("No topic number specified!")

                console.log(topics[(args[3] - 1)].name + "\n\n" + "Date Added: " + new Date(topics[(args[3] - 1)].dateAdded) +"\n" + "Next Review Date: " + new Date(topics[(args[3] - 1)].dateNext) + "\nRepetitions: " + topics[(args[3] - 1)].repetitions)
                return;
        case "all":
                let u = 0
                let y = 0
                while (u < topics.greatest){
                        try{
                                console.log(`${(y + 1)}: ` + topics[u].name)
                                y++
                        } catch(err) {} 
                        u++
                }
                return;
        default:
                console.log("This doesn't appear to be a valid command. Use [executable] help for more information")
                return;
}
