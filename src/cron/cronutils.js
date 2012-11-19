var 
  firstRun = 1000 * 60 * 30   // 30 min from start
, gapJobs  = 1000 * 60 * 60 * 24 * 7 // every week
, instructors = require('../routes/instructors.js')
;
 

exports.updateRankings = function(){

  console.log( "scheduling ranking update at " + new Date() );
  setTimeout (
    function(){
        // First run
        console.log("first ranking update at " + new Date());
        instructors.updateInstructorRanking( function(err) {
          if (err) {console.log(err);}
        });

        // set cron job
        setInterval( function(){
          console.log("cron ranking update at " + new Date());
          instructors.updateInstructorRanking( function(err) {
            if (err) {console.log(err);}
           });
        },gapJobs);
    }
    , firstRun
  ); 
}