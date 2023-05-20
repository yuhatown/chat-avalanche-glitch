var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* 
모든 소켓서버와 연결된 사용자들간의 채팅 
localhost:3000/chat
*/
router.get('/chat', function(req, res, next) {
  res.render('chat.ejs');
});

/* 
채팅방(채널)별로 채팅하기 
localhost:3000/groupchat
*/
router.get('/groupchat', function(req, res, next) {
  res.render('groupchat.ejs');
});


module.exports = router;
