var adminUsers = [
  {
    email: "ehdez73@gmail.com",
    name: "Ernesto Hernández",
    googleId : "116308562574216710328"
  },
  {
    email: "rvidal@extrema-sistemas.com",
    name: "José Roberto Vidal",
    googleId: ""
  }
],
regularUsers = [
  {
    email: "j.roberto.vidal@gmail.com",
    name: "José Roberto Vidal",
    googleId: ""
  }
]

var randomInt = function (max) {
  return Math.floor(Math.random() * max);
}

var users = [],
  courses =  [
    {
      uuid: 'spring-web',
      name: 'Spring Web 3.1',
      duration: '4 days',
      deleted: false,
      link: 'http://mylearn.vmware.com/descriptions/EDU_DATASHEET_SpringWeb_V311.pdf',
      description: 'Rich web applications with spring Soufflé cotton candy sesame snaps liquorice toffee tootsie roll. Danish caramels dessert tart. Tiramisu fruitcake macaroon jelly. Chocolate bar cookie ice cream bear claw powder sweet roll liquorice cheesecake. Topping dessert sugar plum. Cupcake chocolate cake apple pie marzipan marshmallow dessert. '
    },
    {
      uuid: 'html5-css3',
      name: 'HTML5 & CSS3',
      duration: '4 days',
      deleted: false,
      link: 'http://html5.instructormatters.com/',
      description: 'All about HTML5 and CSS3. Jelly beans chocolate bar chocolate cake toffee fruitcake tiramisu toffee bonbon. Pudding powder pastry powder cotton candy danish. Halvah gummies chocolate tiramisu marshmallow macaroon chocolate liquorice donut. Icing icing cupcake chocolate tiramisu jelly beans tootsie roll candy. Halvah candy cookie pastry faworki caramels macaroon lemon drops tart. Croissant sweet roll apple pie. Donut tootsie roll soufflé. Sweet roll candy toffee liquorice faworki.'

    },
    {
      uuid: 'core-spring',
      name: 'Core Spring',
      duration: '4 days',
      deleted: false,
      link: 'https://docs.google.com/viewer?url=http%3A%2F%2Fmylearn.vmware.com%2Fdescriptions%2FEDU_DATASHEET_CoreSpring_V32.pdf',
      description: 'Spring framework 101. The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother\'s keeper and the finder of lost children.'
    },
    {
      uuid: 'eis',
      name: 'Enterprise Integration with Spring.',
      duration: '4 days',
      deleted: false,
      link: 'https://docs.google.com/viewer?url=http%3A%2F%2Fmylearn.vmware.com%2Fdescriptions%2FEDU_DATASHEET_EnterpriseIntegrationSpring_V20.pdf',
      description: 'Learn all about Enterprise Integration with Spring framework.  Look, just because I don\'t be givin\' no man a foot massage don\'t make it right for Marsellus to throw Antwone into a glass motherfuckin\' house, fuckin\' up the way the nigger talks. Motherfucker do that shit to me, he better paralyze my ass, \'cause I\'ll kill the motherfucker, know what I\'m sayin\'?'
    },
],
  places = [
    { "address" : "Venezuela", "geopoint" : { "lat" : 6.42375, "lng" : -66.58973000000003} },
    { "address" : "Usera, Madrid, Spain", "geopoint" : { "lat" : 40.387097, "lng" : -3.7068950000000314  } },
    { "address" : "Alcorcón, Spain", "geopoint" : { "lat" : 40.3491158, "lng" : -3.8288109000000077  } },
    { "address" : "Valencia, Spain", "geopoint" : { "lat" : 39.4702393, "lng" : -0.37680490000002465  } },
    { "address" : "Embajadores, Madrid, Spain", "geopoint" : { "lat" : 40.4004054, "lng" : -3.6952896000000237} },
    { "address" : "Rivas-Vaciamadrid, Spain", "geopoint" : { "lat" : 40.3296966, "lng" : -3.516941299999985} },
    { "address" : "Majadahonda, Spain,", "geopoint" : { "lat" : 40.4728332, "lng" : -3.872304399999962}, },
    { "address" : "Tenerife, Santa Cruz de Tenerife, Spain", geopoint : { lat : 28.2915637, lng: -16.629130400000008} },
], videos = [
  { youtubeId : "V7qnG5rBfO0" },
  { youtubeId : "vMYibbzJlVs" },
  { youtubeId : "rc87EmY5A08" },
  { youtubeId : "vMYibbzJlVs" },
  { youtubeId : "QQul2_fNbhs" },
  { youtubeId : "_2L8L4w7lvE" },
  { youtubeId : "Im1mZokp9go" },
  { youtubeId : "KG5zIouJg-k" },
  { youtubeId : "LmP1EmUUqgU" },
  { youtubeId : "fW8amMCVAJQ" },
  { youtubeId : "ye25XBGhF0A" },
  { youtubeId : "UErR7i2onW0" },
  { youtubeId : "NYbTNFN3NBo" },
  { youtubeId : "amCxbVG8QUs" },
  { youtubeId : "P4cj1t7v5L4" },
  { youtubeId : "gJYn4I-OGJU" },
  { youtubeId : "Yq5hZQ-pM9k" },
  { youtubeId : "ncPQbKBBMgY" },
  { youtubeId : "yqlcsWK7EA8" },
  { youtubeId : "QuG3qrgM4AM" },
  { youtubeId : "5NtBYdgXfJY" },
  { youtubeId : "l797bjL3hKA" },
  { youtubeId : "7ZoSaYZCK8E" },
  { youtubeId : "LdjPmqXXTCU" },
].map(function (video) {
  video.url = "http://www.youtube.com/watch?v=" + video.youtubeId;
  video.title = video.url;
  return video;
}),
  states = ["NEW", "NEW", "NEW", "NEW", "NEW", "PENDING", "PAID"]
  ,
  defaultGoogleId = "109093485030374661399";