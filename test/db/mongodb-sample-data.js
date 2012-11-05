
/* Courses*/

db.courses.save({
  uuid: 'html5-css3',
  name: 'HTML5 & CSS3',
  duration: '4 days',
  deleted: false,
  description: 'All about HTML5 and CSS3'
})

db.courses.save({
  uuid: 'core-spring',
  name: 'Core Spring',
  duration: '4 days',
  deleted: false,
  description: 'Spring framework 101'
})

db.courses.save({
  uuid: 'spring-web',
  name: 'Spring Web 3.1',
  duration: '4 days',
  deleted: false,
  description: 'Rich web applications with spring'
})

db.courses.save({
  uuid: 'eis',
  name: 'Enterprise Integration with Spring',
  duration: '4 days',
  deleted: false,
  description: 'Learn all about Enterprise Integration with Spring framework'
})


/* Users*/ 

db.users.save({
    email: 'ehdez73@gmail.com',
    name: 'Ernesto',
    oauth: '116308562574216710328',
    admin: true,
    deleted: false,
    languages: 'en, es',
    courses: [],
    address : "Madrid, Spain",
    geopoint : { lat : 40.4166909, lng: -3.70034540000006, zoom : 10 }
})


db.users.save({
    email: 'ehdez@extrema-sistemas.com',
    name: 'Ernesto (extrema)',
    oauth: '109792900130705825881',
    admin: false,
    deleted: false,
    courses: ['core-spring','spring-web','eis'],
    languages: 'en, es',
    videos: [ { id: 'RY6dNUL8k6o',
                url: 'http://www.youtube.com/watch?v=RY6dNUL8k6o',
                title: "Practical Tips and Tricks with Spring Integration",
                thumbnail: 'http://i.ytimg.com/vi/RY6dNUL8k6o/hqdefault.jpg',
                locale: 'en',
                courseUUID : 'eis'
              },
              { id: 'TIuI6sjmP7g',
                url: 'http://www.youtube.com/watch?v=TIuI6sjmP7g',
                title: "Intertech - Complete Spring Core Training - Part 3",
                thumbnail: 'http://i.ytimg.com/vi/TIuI6sjmP7g/hqdefault.jpg',
                locale: 'en',
                courseUUID : 'core-spring'
              },
              { id: 'OwN6UdDzZNA',
                url: 'http://www.youtube.com/watch?v=OwN6UdDzZNA',
                title: "Spring Tutorial - Using Spring Web Flow (Part 1 of 2)",
                thumbnail: 'http://i.ytimg.com/vi/OwN6UdDzZNA/hqdefault.jpg',
                locale: 'en',
                courseUUID : 'spring-web'
              }
            ],
    address : "Tenerife, Santa Cruz de Tenerife, Spain",
    geopoint : { lat : 28.2915637, lng: -16.629130400000008, zoom : 9 }

})


db.users.save(
{   email: 'icoloma@gmail.com',
    name: 'Ignacio Coloma',
    oauth: '112843640399200525430',
    admin: false,
    deleted: false,
    courses: ['html5-css3','core-spring'],
    languages: 'en, es',
    videos: [{ id: 'mzPxo7Y6JyA',
                url: 'http://www.youtube.com/watch?v=mzPxo7Y6JyA',
                title: "What is HTML5?",
                thumbnail: 'http://i.ytimg.com/vi/mzPxo7Y6JyA/hqdefault.jpg',
                locale: 'en',
                courseUUID : 'html5-css3'
              },
               { id: 'ZXkwxeeUU7U',
                url: 'http://www.youtube.com/watch?v=ZXkwxeeUU7U',
                title: "Spring Source Core Spring Training",
                thumbnail: 'http://i.ytimg.com/vi/ZXkwxeeUU7U/hqdefault.jpg',
                locale: 'en',
                courseUUID : 'core-spring'
              }],
    address : "Madrid, Spain",
    geopoint : { lat : 40.4166909, lng: -3.70034540000006, zoom : 10 }
})