/*
 Admin user data
*/
var admin = {
    email : "ehdez73@gmail.com",
    name : "Ernesto"
  };

use instructormatters;


db.certificates.drop();
db.editions.drop();
db.videos.drop();
db.users.drop();
db.courses.drop();

/* Courses*/

db.courses.save({
  uuid: 'html5-css3',
  name: 'HTML5 & CSS3',
  duration: '4 days',
  deleted: false,
  description: 'All about HTML5 and CSS3'
});

db.courses.save({
  uuid: 'core-spring',
  name: 'Core Spring',
  duration: '4 days',
  deleted: false,
  description: 'Spring framework 101'
});

db.courses.save({
  uuid: 'spring-web',
  name: 'Spring Web 3.1',
  duration: '4 days',
  deleted: false,
  description: 'Rich web applications with spring'
});

db.courses.save({
  uuid: 'eis',
  name: 'Enterprise Integration with Spring',
  duration: '4 days',
  deleted: false,
  description: 'Learn all about Enterprise Integration with Spring framework'
});


/* Users*/ 


db.users.save({
    email: admin.email,
    name: admin.name,
    aboutMe : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dapibus tincidunt leo, quis pellentesque massa accumsan in. Nunc imperdiet volutpat diam quis euismod. Vivamus sed endrerit orci. Integer aliquet felis et urna vestibulum nec aliquam orci tempor. In vitae sem augue. Morbi luctus ',
    admin: true,
    deleted: false,
    certificates: ['core-spring','spring-web','eis'],
    courses: ['core-spring','spring-web','eis'],
    languages: 'en, es',
    address : "Tenerife, Santa Cruz de Tenerife, Spain",
    geopoint : { lat : 28.2915637, lng: -16.629130400000008, zoom : 9 }

});

var adminUser = db.users.findOne({email:admin.email});

db.videos.save(
  { youtubeId: 'RY6dNUL8k6o',
    instructorId: adminUser._id,
    instructorName: adminUser.name,
    url: 'http://www.youtube.com/watch?v=RY6dNUL8k6o',
    title: "Practical Tips and Tricks with Spring Integration",
    thumbnail: 'http://i.ytimg.com/vi/RY6dNUL8k6o/hqdefault.jpg',
    locale: 'en',
    courseUUID : 'eis',
    ranking: {
      numLikes: 300,
      numDislikes: 200,
      value: 200
    }
  }
);

db.videos.save(
  { youtubeId: 'TIuI6sjmP7g',
    instructorId: adminUser._id,
    instructorName: adminUser.name,
    url: 'http://www.youtube.com/watch?v=TIuI6sjmP7g',
    title: "Intertech - Complete Spring Core Training - Part 3",
    thumbnail: 'http://i.ytimg.com/vi/TIuI6sjmP7g/hqdefault.jpg',
    locale: 'en',
    courseUUID : 'core-spring',
    ranking: {
      numLikes: 500,
      numDislikes: 300,
      value: 100
    }
  }
);

db.videos.save(
  { youtubeId: 'OwN6UdDzZNA',
    instructorId: adminUser._id,
    instructorName: adminUser.name,
    url: 'http://www.youtube.com/watch?v=OwN6UdDzZNA',
    title: "Spring Tutorial - Using Spring Web Flow (Part 1 of 2)",
    thumbnail: 'http://i.ytimg.com/vi/OwN6UdDzZNA/hqdefault.jpg',
    locale: 'en',
    courseUUID : 'spring-web',
    ranking: {
      numLikes: 700,
      numDislikes: 300,
      value: 100
    }
  }
);