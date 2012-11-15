var adminUser = {
  email: "rvidal@extrema-sistemas.com",
  name: "José Roberto Vidal",
}

var randomInt = function (max) {
  return Math.floor(Math.random() * max);
}

var users = [
  {
    email: adminUser.email,
    name: adminUser.name,
    aboutMe : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dapibus tincidunt leo, quis pellentesque massa accumsan in. Nunc imperdiet volutpat diam quis euismod. Vivamus sed endrerit orci. Integer aliquet felis et urna vestibulum nec aliquam orci tempor. In vitae sem augue. Morbi luctus ',
    admin: true,
    deleted: false,
    certificates: ['core-spring','spring-web','eis'],
    courses: ['core-spring','spring-web','eis'],
    languages: 'en, es',
    address : "Tenerife, Santa Cruz de Tenerife, Spain",
    geopoint : { lat : 28.2915637, lng: -16.629130400000008, zoom : 9 }
  },
  {
    email: "j.roberto.vidal@gmail.com",
    name: "J. Roberto Vidal",
    aboutMe : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dapibus tincidunt leo, quis pellentesque massa accumsan in. Nunc imperdiet volutpat diam quis euismod. Vivamus sed endrerit orci. Integer aliquet felis et urna vestibulum nec aliquam orci tempor. In vitae sem augue. Morbi luctus ',
    admin: false,
    deleted: false,
    certificates: ['core-spring','html5-css3','eis'],
    courses: ['core-spring','eis'],
    languages: 'en, es',
    address : "Madrid, Spain",
    geopoint :  { "lat" : 40.4166909, "lng" : -3.70034540000006, "zoom" : 10 }
  },
  {
    email: "ehdez73@gmail.com",
    name: "Ernesto",
    aboutMe : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dapibus tincidunt leo, quis pellentesque massa accumsan in. Nunc imperdiet volutpat diam quis euismod. Vivamus sed endrerit orci. Integer aliquet felis et urna vestibulum nec aliquam orci tempor. In vitae sem augue. Morbi luctus ',
    admin: false,
    deleted: false,
    certificates: ['core-spring','spring-web','html5-css3'],
    courses: ['html5-css3','spring-web'],
    languages: 'en, es',
    address : "La Alberca, Murcia, Spain",
    geopoint : { "lat" : 37.9423583, "lng" : -1.1434944999999743, "zoom" : 14 }
  },
],
  courses =  [
    {
      uuid: 'spring-web',
      name: 'Spring Web 3.1',
      duration: '4 days',
      deleted: false,
      description: 'Rich web applications with spring'
    },
    {
      uuid: 'html5-css3',
      name: 'HTML5 & CSS3',
      duration: '4 days',
      deleted: false,
      description: 'All about HTML5 and CSS3'
    },
    {
      uuid: 'core-spring',
      name: 'Core Spring',
      duration: '4 days',
      deleted: false,
      description: 'Spring framework 101'
    },
    {
      uuid: 'eis',
      name: 'Enterprise Integration with Spring',
      duration: '4 days',
      deleted: false,
      description: 'Learn all about Enterprise Integration with Spring framework'
    },
],
  places = [
    { "address" : "Venezuela", "geopoint" : { "lat" : 6.42375, "lng" : -66.58973000000003 } },
    { "address" : "Usera, Madrid, Spain", "geopoint" : { "lat" : 40.387097, "lng" : -3.7068950000000314 } },
    { "address" : "Alcorcón, Spain", "geopoint" : { "lat" : 40.3491158, "lng" : -3.8288109000000077 } },
    { "address" : "Valencia, Spain", "geopoint" : { "lat" : 39.4702393, "lng" : -0.37680490000002465 } },
    { "address" : "Embajadores, Madrid, Spain", "geopoint" : { "lat" : 40.4004054, "lng" : -3.6952896000000237 } },
    { "address" : "Rivas-Vaciamadrid, Spain", "geopoint" : { "lat" : 40.3296966, "lng" : -3.516941299999985 } },
    { "address" : "Majadahonda, Spain,", "geopoint" : { "lat" : 40.4728332, "lng" : -3.872304399999962 } }
], videos = [
  { url: "http://www.youtube.com/watch?v=V7qnG5rBfO0" , youtubeId : "V7qnG5rBfO0"},
  { url: "http://www.youtube.com/watch?v=vMYibbzJlVs" , youtubeId : "vMYibbzJlVs"},
  { url: "http://www.youtube.com/watch?v=rc87EmY5A08" , youtubeId : "rc87EmY5A08"},
  { url: "http://www.youtube.com/watch?v=vMYibbzJlVs" , youtubeId : "vMYibbzJlVs"},
  { url: "http://www.youtube.com/watch?v=QQul2_fNbhs" , youtubeId : "QQul2_fNbhs"},
  { url: "http://www.youtube.com/watch?v=_2L8L4w7lvE" , youtubeId : "_2L8L4w7lvE"},
  { url: "http://www.youtube.com/watch?v=Im1mZokp9go" , youtubeId : "Im1mZokp9go"},
  { url: "http://www.youtube.com/watch?v=KG5zIouJg-k" , youtubeId : "KG5zIouJg-k"},
  { url: "http://www.youtube.com/watch?v=LmP1EmUUqgU" , youtubeId : "LmP1EmUUqgU"},
  { url: "http://www.youtube.com/watch?v=fW8amMCVAJQ" , youtubeId : "fW8amMCVAJQ"},
  { url: "http://www.youtube.com/watch?v=ye25XBGhF0A" , youtubeId : "ye25XBGhF0A"},
],
  states = ["NEW", "NEW", "NEW", "NEW", "NEW", "PENDING", "PAID"];

// use instructormatters;
var db = connect('localhost/instructormatters');
db.certificates.drop();
db.editions.drop();
db.videos.drop();
db.users.drop();
db.courses.drop();

//Create users
users.forEach(function (user) {
  db.users.save(user);
});

//Recover user IDs
users.forEach(function (user) {
  user._id = db.users.findOne({email: user.email}, {_id: true})._id;
})

// Create courses
courses.forEach(function (course) {
  db.courses.save(course);
})


//Create random editions
var numEditions = 30,
  editions = [],
  numUsers = users.length, numCourses = courses.length, numPlaces = places.length, numStates = states.length,
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
    instructor: oneUser._id,
    instructorName: oneUser.name,
    state: states[Math.round(Math.random() * numStates)],
    courseUUID: oneCourse.uuid,
    date: oneDate
  })
}

//Create videos

var locales = ["en", "es"], numVideos = videos.length, oneVideo;

for(var i = 0; i < numUsers; i++) {
  oneUser = users[i];

  for(var j = 0; j < 3; j ++) {
    oneVideo = videos.splice(randomInt(numVideos), 1)[0],
    numVideos = videos.length;

    var likes = randomInt(1000),
      dislikes = randomInt(likes);

    Object.extend(oneVideo, {
      title: Math.random().toString(36).substring(6),
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