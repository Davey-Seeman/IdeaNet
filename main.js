// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, push, orderByKey,onChildAdded,update, query, orderByChild, get} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD_ziOsM9pR1hPixreijav-bry7MnDYyBQ",
    authDomain: "ideanet-645b1.firebaseapp.com",
    projectId: "ideanet-645b1",
    storageBucket: "ideanet-645b1.appspot.com",
    messagingSenderId: "504272300823",
    appId: "1:504272300823:web:3f9d8074bc9193713d6552",
    measurementId: "G-Y1K8448V23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
var ideas = ref(database,"Ideas");
var oldDataHold = {};
var dataHold = {};
onValue(ideas, (snapshot) => {
    const data = snapshot.val();
    gotList(data,dataHold);
});

reset();


function reset(){ //resets variables to be reused in sorting functions
    document.getElementById("postSection").innerHTML = "";
    try{
       ideaNumber = counter = 0;
       likedAlrdy = reportedAlrdy = false
    }catch(error){};
};

function addData(){
    var ideaNumber = Object.values(oldDataHold).length;

    var tit = document.getElementById("titleInput").value;
    var des = document.getElementById("descriptionInput").value;
    var aud = document.getElementById("audienceInput").value;
    var imp = document.getElementById("importanceInput").value;
    var img = document.getElementById("imageInput").value;
    var tags = document.getElementById("tagInput").value;

    var tagArr = tags.split(" ");
    var tagObj = {};

    for (var i = 0; i < tagArr.length; i++){ //contstruct obj containing all inputted tags w each word from input
        if(tagArr[i]){ //only add to database if tag is truthy
            tagObj[i] = tagArr[i]; //tag index system may skip values if user inputs multiple spaces in a row, however this does not affect the program
        };
    };

    if(tit.length == 0 || des.length == 0 || aud.length == 0 || imp.length == 0){  //end function if not all input boxes are full on idea submit page
        alert("Please input in all fields");
        return;
    };

    if(tit.split(' ').length > 9) { //check if title is too long (part of success criteria 1)
        alert("Your title is too long");
        return;
    };

    if (img.match(/\.(jpeg|jpg|gif|png)$/) == null){  //also check if image is invalid seperatedly as it is a success criteria

        //case where img is invalid
        if(confirm("You are sumbitting a post without an image, is that ok?") == false){ //confirmation
                return;
        };
    };

    //function will only continue if url is valid or user clicked "Ok" in response to the invalid image confirmation

    var data = //Idea data
        {
            title: tit,
            description: des,
            targetAudience: aud,
            importance: imp,
            imageURL: img,
            likes: 0,
            reports: 0,
            tags: tagObj,
            comments: 0
        }
    set(push(ref(database, 'Ideas')), {
        data
    });
    //ref.child('Idea' + (ideaNumber+1)).set(data);
    postModal.style.display = "none";

    data.tags = tagArr; //for data passed into onscreen addPost function

    alert("Your Idea Has Been Posted... Thank You!");
    window.location.reload();
};

function addLike(currentPost){
    var key = currentPost.getAttribute("key")
    const likes = ref(database, 'Ideas/' + key + '/data/likes');
    get(likes).then((snapshot) => {
        const likesNumber = snapshot.val();
        update(ref(database,'Ideas/'+currentPost.getAttribute("key")+'/data'),{
        likes: likesNumber + 1})

        document.getElementById("likesCount" + currentPost.id.match(/\d+/g)[0]).innerHTML = likesNumber + 1 //add 1 to the on screen like count //use id no matter what for onscreen changes

        document.getElementById("likesPost" + currentPost.id.match(/\d+/g)[0]).innerHTML = likesNumber + 1 //add 1 to the browsing page on-hover like count
    });
};

function reported(currentPost){ //adds report to database
    alert("Thank you for reporting this idea. We will review it soon.");
    /*reportNumber = currentPost.id.match(/\d+/g)[0]; //regex to grab # from id

    increment = database.ref("Ideas/Idea" + reportNumber);

    if(reportedAlrdy == false){ //check if post has already been reported
        newReported = reportNumber + 1;
        increment.update({reports: newReported}); //increment report number by 1
        alert("Your report has been recorded");
        reportedAlrdy = true;

        //remove post from firebase database if the number of reports are equal to or greater than 1/5 of the number of likes:

        likesNumber = dataHold["Idea" + reportNumber]["likes"];

        if (likesNumber/5 <= newReported){
            //increment.remove(); //this line removes idea from firebase database. However instead of removing the idea from the database I will add the post to a "deletable" section of the database so that I (the client) could review whether it should be taken down or the report button was mistakenly pressed: (the remove() feature will be used if my website gets too populated to monitor)

            deletableSection = database.ref("Deletable");
            title = document.getElementById("title" + reportNumber);
            deletableSection.push("Delete Post: " + title.innerHTML);
        };
    };*/

};

function showSuggested(){

    document.getElementById("suggestions").style.display = "block"; //make visible

    document.getElementById("suggestions").innerHTML = " "; //clear suggestions 

    //the following code searches the firebase database to find tags that match the input:

    ref.once("value", searchTags, errData);
};

function searchTags(data){
    data = data.val();

    input = document.getElementById("searchInput").value;
    suggestionCounter = 0; //used limit # of tag suggestions to 4
    suggestionList = []; //to make sure the program does not show the same suggestion twice

    baseLoop:
    for (const idea in data){ //loops through ideas
        for (const tags in data[idea]["tags"]){ //loops through all tags on each idea

            singleTag = data[idea]["tags"][tags].toLowerCase(); //keep everything lower case

            if (singleTag.includes(input.toLowerCase())){ //check if input is contained in any tags
                if (suggestionList.includes(singleTag)){ //make sure same tag cannot be shown twice
                    continue;
                };
                suggestionList.push(singleTag);
                newSuggestion = document.createElement("button");
                newSuggestion.appendChild(document.createTextNode(singleTag));
                newSuggestion.setAttribute("id","tagName: " + singleTag);
                newSuggestion.setAttribute("onclick","sortTagged(this)");
                document.getElementById("suggestions").appendChild(newSuggestion);
                suggestionCounter ++;
                if (suggestionCounter > 3) { //maximize suggestionCounter to 4
                    break baseLoop;
                };
            };
        };
    };
};

function hideSuggested(){
    document.getElementById("suggestions").style.display = "none";
};

function addComment(currentPost){

    /*try { //comment section number is based on class name IF it was called after a sorting function. Otherwise null
        var commentNumber = currentPost.className.match(/\d+/g)[0];  //regex to grab # from id
    } catch { //If addLike is called directly from original posting function
        var commentNumber = currentPost.id.match(/\d+/g)[0]; //regex to grab # from id
    };*/
    comment = document.getElementById("commentTxt" + currentPost.getAttribute("key")).value;

    if(comment.length){
        /*
        var onScreenComments = document.getElementById("commentList" + commentNumber);

        var commentEntry = document.createElement("p");
        commentEntry.className = "idea-comments";
        commentEntry.appendChild(document.createTextNode(comment));

        onScreenComments.appendChild(commentEntry); //add comment onscreen 

        //add <br> line breaks to comment based on how many lines comment is to avoid overlap over other comments

        if (comment.length > 45){ //there are approximately 45 characters in a line
            approxLineNumber = String(comment.length/45).charAt(0);
            linebreak = document.createElement("br");
            for (j = 0; j < approxLineNumber; j++){
                onScreenComments.appendChild(linebreak); //add line break approxLineNumber times
            };
        };*/

       push(ref(database,'Ideas/'+currentPost.getAttribute("key")+'/data/comments'),comment)
       //updateKey = database.ref("Ideas/Idea" + commentNumber + "/comments");
       //updateKey.push(comment); //add to database*/

    } else {

        alert("No comment has been inputted");

};
};
function gotList(allData,dataHold) //shows all the ideas on the browsing feed
    {	
    var postDisplay = document.getElementById("postSection").innerHTML = ""; //clear all posts (useful for when function is recalled in "clear tags" button)

    //allData = data.val() //val function turns data into dictionary
    var keyValues = Object.keys(allData);

    var multiDigitPosts = [];

    if(keyValues.length > 9)
    { //adjust array to work with multi digit numbers (in firebase ordering/indexing does not work w more than 10 posts)
        for(key in allData){ //allData must be reordered so that multi digit posts come after single digit posts; unfortunately in firebase idea10 comes before idea2 for example
        		
            keyNumber = key.match(/\d+/g)[0]; //regex finds number in key
            if(keyNumber >= 10){ //check if key is multiple digits.
                multiDigitPosts.push(key); //add multidigit value into array
                keyValues.splice(keyValues.indexOf(key), 1); //delete multidigit value from keyValues (it is to be added back to the end though)
            };
        };
        keyValues.push(...multiDigitPosts); //use of spread operator to put multiDigitPosts at the end of single digit posts
    };


    var ideaNumber = 1
    for(const [key, value] of Object.entries(allData)){
        showPost(value,ideaNumber,key)
        ideaNumber++
    }

        /*for (i = 0; (i < keyValues.length) && (i < 18); i++) //this will either draw 18 posts or all the posts in my database (only if it is under 18), if 18 posts is too laggy I could change this number (keyValues.length) to be less
        {   
        	keyName = "Idea" + (i+1);
        	allData[keyName]["number"] = (i+1); //variable is used for adding likes after tag sort
        	dataHold[keyValues[i]] = allData[keyName]; //dataHold should be sorted in the same way as keyValues and only be the length of the # of posts being displayed (this is why it is put in the for loop)
            //var databaseIdeas = ref(database,"Ideas/" + keyValues[i]);
            //databaseIdeas.once("value", showPost, errData);
            console.log(allData[keyName])
            showPost(allData[keyName],i+1,dataHold)
        };*/

        oldDataHold = dataHold;
};

function sortByLikes(){
    document.getElementById("postSection").innerHTML = "";
    const ordering = query(ref(database, 'Ideas'), orderByChild('data/likes'));
    var backData = []
    var backKeys = []
    onChildAdded(ordering, (snapshot, childKey) => {
        const data = snapshot.val(); 
        backData.push(data);
        backKeys.push(childKey)
    });
    
    for (let i = 0; i < backData.length; i++) {
        showPost(backData[backData.length-i-1],i+1,backKeys[backData.length-i-1]);
    }
}

function sortByAlpha(){
    document.getElementById("postSection").innerHTML = "";
    const ordering = query(ref(database, 'Ideas'), orderByChild('data/title'));
    var ideaNumber = 1;
    onChildAdded(ordering, (snapshot, childKey) => {
        ideaNumber++;
        const data = snapshot.val(); 
        showPost(data,ideaNumber,childKey);
    });
    
}

export { addData, reset, addLike, reported, addComment, hideSuggested, searchTags, sortByLikes, sortByAlpha};