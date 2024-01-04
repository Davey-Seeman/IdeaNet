function sortTagged(tagName){ //searches through database for all posts that match this tag and then displays only them
    //reset();
    document.getElementById("postSection").innerHTML = "";

    tag = tagName.id.split("tagName: ")[1].toLowerCase();

  	//display only values with tag in dataHold dictionary:

  	dataList = Object.values(dataHold);
  	reset();
  	oldDataHold = dataHold; //holds old data so that actions can still be performed when on sorting page
  	dataHold = {}; //reset dataHold to only contain tagged posts so that tagged posts can be sorted
  	insertCounter = 1; //for constructing object

  	for (i = 0; i < dataList.length; i++){ //loops through ideas
 			for (const tags in dataList[i]["tags"]){ //loops through all tags on each idea

 				currentTag = dataList[i]["tags"][tags].toLowerCase();

 				if (currentTag == tag){ //check if tag = currentTag
 					dataHold["Idea" + insertCounter] = dataList[i];
 					showPost(dataHold["Idea" + insertCounter]); //redraw posts with tag match

          //fix bug where comments show up to the wrong post after sorting:
          commentArray = Object.values(dataList[i]["comments"]);
          commentDisplay(commentArray, insertCounter);

          //allow users to like posts after sorting:

          likeBtn = document.getElementById("likesOnPost" + insertCounter);
          likeBtn.classList.add("dateSorted" + (i + 1)); //changing class allows addLike function to assess post based on its new class name

          //a similar thing but for comments:

          document.getElementById("commentTxt" + insertCounter).classList.add("commentTxt" + (i + 1));

 					insertCounter ++;

 					break;
 				};
 			};
 		};

 	};

  /*function sortByLikes (){
    //reset();
    document.getElementById("postSection").innerHTML = "";
    import('./main.js').then(module => module.ideas)
    console.log(import('./main.js').then(module => module.ideas))
    
    /*OLD WAY: sort dataHold dictionary by likes: 

    holdList = Object.values(dataHold);
    likesSorted = holdList.sort(function(a, b) { return b.likes - a.likes; }); // Sort by likes

    for (i = 0; i < likesSorted.length; i++){

      updateObj = Object.assign({}, dataHold["Idea" + (ideaNumber + 1)], likesSorted[i]); //reset like numbers and other data in dataHold
      dataHold["Idea" + (ideaNumber + 1)] = updateObj;
      showPost(likesSorted[i]); //redraw all posts

      //fix bug where comments show up to the wrong post after sorting:

      commentArray = Object.values(likesSorted[i]["comments"]);

      commentDisplay(commentArray, (i+1));

      //allow users to like posts after sorting:

      likeBtn = document.getElementById("likesOnPost" + ideaNumber);
      likeBtn.classList.add("dateSorted" + (i + 1)); //changing class allows addLike function to assess post based on its class
    };

  };*/


  /*function sortByDate (){
    //reset();
    document.getElementById("postSection").innerHTML = "";
    entriesCount = Object.keys(dataHold).length + 1; //function is done with oldDataHold in case dataHold was already changed in sortByLikes
    
    for (const i in dataHold) //draws posts in reverse order, from newest to oldest, looping through oldDataHold dictionary (not dataHold because that would be changed if sortingByLikes was already done)
      {
        loopCount = i.match(/\d+/g)[0]; //regex to grab # from i (compatible with multidigit numbers)

        reversedCount = entriesCount - loopCount;
        reversedKey = "Idea" + reversedCount;

        showPost(dataHold[reversedKey]);

        //fix bug where like number shows up to the wrong post after sorting:

        document.getElementById("likesPost" + ideaNumber).innerHTML = dataHold[reversedKey]["likes"];
        document.getElementById("likesCount" + ideaNumber).innerHTML = dataHold[reversedKey]["likes"];

        //allow users to like posts after sorting:

        likeBtn = document.getElementById("likesOnPost" + ideaNumber);
        likeBtn.classList.add("dateSorted" + reversedCount); //changing class allows addLike function to assess post based on its class

        //fix bug where comments show up to the wrong post after sorting:

        commentArray = Object.values(dataHold[reversedKey]["comments"]);

        commentDisplay(commentArray, parseInt(loopCount));

      };
  };*/