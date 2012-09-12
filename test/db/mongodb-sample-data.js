
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
    deleted: false,/
    courses: []
})


db.users.save({
    email: 'ehdez@extrema-sistemas.com',
    name: 'Ernesto (extrema)',
    oauth: '109792900130705825881',
    admin: false,
    deleted: false,
    courses: ['core-spring','spring-web','eis'],
    videos: [ { id: 'IXXZEhjA5IY',
                url: 'http://www.youtube.com/watch?v=IXXZEhjA5IY',
                title: "Cloud Foundry's Auto-Reconfiguration Feature for Node.js Apps",
                thumbnail: 'http://i.ytimg.com/vi/IXXZEhjA5IY/hqdefault.jpg',
                locale: 'en'
              },
              { id: 'vCjisAATDUM',
                url: 'http://www.youtube.com/watch?v=vCjisAATDUM',
                title: "SQL? NoSQL? NewSQL? What's a Java developer to do?",
                thumbnail: 'http://i.ytimg.com/vi/vCjisAATDUM/hqdefault.jpg',
                locale: 'en'
              }]
})


db.users.save({
    email: 'icoloma@gmail.com',
    name: 'Ignacio Coloma',
    oauth: '112843640399200525430',
    admin: false,
    deleted: false,
    courses: ['html5-css3'],
    videos: []
})