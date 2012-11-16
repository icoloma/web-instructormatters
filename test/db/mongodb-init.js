var numCourses = courses.length, numPlaces = places.length, numStates = states.length;

// use instructormatters;
var db = connect('localhost/instructormatters');
db.certificates.drop();
db.editions.drop();
db.videos.drop();
db.users.drop();
db.courses.drop();

//
//Create users
//

var extraUsers = 50;

var randomizeUser = function (user) {
  var excludedCourse = randomInt(numCourses),
    excludedCert = randomInt(numCourses - 1),
    chosenCourses = [],
    chosenCerts = []
    chosenLocation = places[randomInt(numPlaces)];

  courses.forEach(function (course, i) {
    if(i !== excludedCourse)
      chosenCourses.push(course.uuid);
  });
  // print(i)
  chosenCourses.forEach(function (course, i) {
    if(i !== excludedCert)
      chosenCerts.push(course);
  });

  Object.extend(user, {
    deleted: false,
    admin: false,
    aboutMe: Math.random().toString(36) + " " +  Math.random().toString(36),
    courses: chosenCourses,
    certificates: chosenCerts,
    address: chosenLocation.address,
    geopoint: chosenLocation.geopoint,
  });
  if (!user.googleId){
    user.googleId = defaultGoogleId;
  }
  return user;
}

//Create admin users
adminUsers.forEach(function (user) {
  user = randomizeUser(user);
  user.admin = true;
  users.push(user);
  db.users.save(user);
});

//Create regular users
regularUsers.forEach(function (user) {
  user = randomizeUser(user);
  users.push(user);
  db.users.save(user);
});

//Create random users
for(var i = 0; i < extraUsers; i++) {
  var extraUser = {
    name: Math.random().toString(36).substring(6),
    email: Math.random().toString(36).substring(6) + "@" +
            Math.random().toString(36).substring(6) + "." + Math.random().toString(36).substring(3)
  };
  extraUser = randomizeUser(extraUser);
  users.push(extraUser);
  db.users.save(extraUser);
}

//Recover user IDs
users.forEach(function (user) {
  user._id = db.users.findOne({email: user.email}, {_id: true})._id;
})

// Create courses
courses.forEach(function (course) {
  db.courses.save(course);
})

//Create random editions
var numEditions = 60,
  editions = [],
  numUsers = users.length,
  oneCourse, isCertified, oneUser, onePlace, oneDate,
  now = new Date();

for(var i = 0; i < numEditions; i++) {
  oneCourse = courses[randomInt(numCourses)],
  onePlace = places[randomInt(numPlaces)],
  oneDate = new Date(now.getTime() + Math.round(Math.random() * 1000000000)),
  isCertified = false;

  while(!isCertified) {
    oneUser = users[randomInt(numUsers)];
    if(oneUser.certificates.indexOf(oneCourse.uuid) > -1) {
      isCertified = true;
    }
  }


  db.editions.save({
    deleted: false,
    address: onePlace.address,
    geopoint: onePlace.geopoint,
    instructorId: oneUser._id,
    instructorName: oneUser.name,
    state: states[Math.round(Math.random() * numStates)],
    courseUUID: oneCourse.uuid,
    date: oneDate
  })
}

//Create videos
var getVideo = function () { 
  var randomVideo = videos[randomInt(videos.length)];
  var video = { 
      youtubeId : randomVideo.youtubeId,
      url: randomVideo.url
    };
  return video;}
;

var locales = ["en", "es"], oneVideo;

for(var i = 0; i < numUsers; i++) {
  oneUser = users[i];

  for(var j = 0; j < 3; j ++) {
    var oneVideo = getVideo();
    
    var likes = randomInt(1000),
      dislikes = randomInt(likes);

    Object.extend(oneVideo, {
      title: oneUser.name + "-video:" + Math.random().toString(36).substring(6),
      locale: locales[randomInt(2)],
      instructorId: oneUser._id,
      instructorName: oneUser.name,
      courseUUID: courses[randomInt(numCourses)].uuid,
      ranking: {
        numLikes: likes,
        numDislikes: dislikes,
        value: likes - dislikes
      },
      duration: randomInt(180),
      thumbnail: "http://i.ytimg.com/vi/" + oneVideo.youtubeId + "/mqdefault.jpg"
    });


    db.videos.save(oneVideo);
  }
}