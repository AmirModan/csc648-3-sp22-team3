const db = require("../config/database");
const { getMessagesForProduct } = require("../models/Messages");
const messagesMiddleware = {};

messagesMiddleware.loadMyMessages = async (req, res, next) => {
  //user that is signed in
  let userId = req.session.userId
  const myPosts = res.locals.myPosts
  let messages = []

    for (let i = 0; i < myPosts.length; i++) {
      try{
        let results = await getMessagesForProduct(myPosts[i].id)
        for(let j = 0; j < results.length; j++){
          messages.push(results[j])
        }
      }catch{
        console.log(err)
      }
    }
    res.locals.myMessages = messages
    next();
}
//   db.execute(baseSQL, [userId])
//     .then(([results, fields]) => {
//       res.locals.myMessages = results;
//       if (results && results.length == 0) {
//         console.log("no posts yet");
//       }
//       next();
//     })
//     .catch((err) => console.log(err));
// };

module.exports = messagesMiddleware;