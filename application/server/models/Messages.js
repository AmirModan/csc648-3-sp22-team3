var db = require("../config/database");
const MessageModel = {};

MessageModel.create = (buyerId, productId, message) => {
    let baseSQL = `INSERT INTO messages (text, productId, buyerId) VALUES (?,?,?);`
    return db.query(baseSQL, [message, productId, buyerId])
    .then(([results, fields]) => {
        console.log(results)
        if(results && results.affectedRows){
            return Promise.resolve(results.insertId);
        }else{
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(err));
}

MessageModel.getMessagesForProduct = (postId) => {
    let baseSQL =  
    `SELECT u.username, m.text, m.created, m.id, p.title, m.productId
    FROM messages m
        INNER JOIN users u ON u.id = m.buyerId
        INNER JOIN products p ON p.id = m.productId 
    WHERE m.productId=?
    ORDER BY m.created DESC`;
    return db.query(baseSQL, [postId])
    .then(([results, fields]) =>{
        //console.log(results)
        return Promise.resolve(results);
    })
    .catch(err => Promise.reject(err));
}

MessageModel.getMessagesForUser = (userId) => {
    let baseSQL = 
    `SELECT u.username, m.text, m.created, m.id
    FROM messages m
        INNER JOIN users u ON u.id = m.buyerId
        INNER JOIN products p ON p.id = m.productId 
    WHERE m.productId=?
    ORDER BY m.created DESC`
}

module.exports = MessageModel;