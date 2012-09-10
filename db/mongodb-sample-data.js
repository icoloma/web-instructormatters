
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
    admin: true,
    deleted: false,
    courses: []
})


db.users.save({
    email: 'ehdez@extrema-sistemas.com',
    admin: false,
    deleted: false,
    courses: ['core-spring','spring-web','eis']
})

db.users.save({
    email: 'icoloma@gmail.com',
    admin: false,
    deleted: false,
    courses: ['html5-css3']
})