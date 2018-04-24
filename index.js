var TelegramBot = require('node-telegram-bot-api');
var firebase = require("firebase");

var token = '567623277:AAEX_MY84jkQAoO_PnNFfQj_ruAd34mh0kw';
var bot = new TelegramBot(token, {polling: true});


var config = {
  apiKey: "AIzaSyAAz19TUkdRRCVUg0nS3ljLVQdSFOvmvBs",
  authDomain: "telegram-bot-da5d4.firebaseapp.com",
  databaseURL: "https://telegram-bot-da5d4.firebaseio.com",
  storageBucket: "telegram-bot-da5d4.appspot.com"
};
firebase.initializeApp(config);
var database = firebase.database();

const LIKES = 'LIKES';
const SUBSCRIBERS = 'SUBSCRIBERS';
const lastMessage = 'lastMessage';

function sendOrder(type, quantity)
{

}

function Order(free, what, type, paid, apiUrl, id){
  this.free = free;
  this.what = what;
  this.type = type;
  this.paid = paid;
  this.apiUrl = apiUrl;
  this.Id = id;
}

function goBack(chatId){
  database.ref('CHATS/'+chatId).child(lastMessage).once('value', function(snapshot){
    const message = snapshot.val();
    switch (message) {
      case "Хочу накрутку":
        sendStartKeyboard(chatId);
        break;
      case "Бесплатные лайки":
        sendStartKeyboard(chatId);
        break;
      case "Разработчик":
        sendStartKeyboard(chatId);
        break;
      case "Статус моего заказа":
        sendStartKeyboard(chatId);
        break;
      case "Кто я такой":
        sendStartKeyboard(chatId);
        break;
      case "Техподдержка":
        sendStartKeyboard(chatId);
        break;
      case "Платно":
        sendPaidVariants(chatId);
        break;
      default:

    }
  });
}

function sendStartKeyboard(chatId)
{
  const opts = {
      reply_markup: {
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: [ ['Хочу накрутку','Статус моего заказа'],['Кто я такой','Техподдержка'],['Разработчик', 'Бесплатные лайки'] ]
      }
  };
  setLastMessage(chatId, '');
  bot.sendMessage(chatId, "Выберите нужный вариант", opts);
}

function setLastMessage(chatId, message)
{
  database.ref('CHATS/'+chatId).child(lastMessage).set(message);
}

function sendCheatVariants(chatId)
{
  const instOpts = {
      reply_markup: {
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: [ ['Подписчики','Лайки'],['Назад'] ]
      }
  };
  database.ref('CHATS/'+chatId).child("currentOrder").child('free').set(false);
  setLastMessage(chatId,'Платно');
  bot.sendMessage(chatId, "Выберите услугу", instOpts);
}

function sendPaidVariants(chatId)
{
  const opts = {
      reply_markup: {
          resize_keyboard: true,
          one_time_keyboard: true,
          keyboard: [ ['Платно','Назад'] ]
      }
  };
  setLastMessage(chatId, "Хочу накрутку");
  bot.sendMessage(chatId, "Выберите нужный вариант", opts);
}

// Написать мне ... (/echo Hello World! - пришлет сообщение с этим приветствием.)
bot.onText(/\/start/, function (msg, match) {
    var chatId = msg.chat.id;
    sendStartKeyboard(chatId);
  });

// Простая команда без параметров.
bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    switch(msg.text){
      case "Хочу накрутку":
        sendPaidVariants(chatId);
        break;
      case "Платно":
        sendCheatVariants(chatId);
        break;
      case "Бесплатные лайки":
        database.ref('CHATS/'+chatId).child("currentOrder").child('free').set(true);
        bot.sendMessage(chatId,"Ваше задание:");
        setLastMessage(chatId,'Бесплатные лайки');
        break;
      case "Лайки":
        database.ref('CHATS/'+chatId).child("currentOrder").child('what').set(LIKES);
        setLastMessage(chatId,'Лайки');
        bot.sendMessage(chatId,"Выберите фильтры");
        break;
      case "Подписчики":
        database.ref('CHATS/'+chatId).child("currentOrder").child('what').set(SUBSCRIBERS);
        setLastMessage(chatId,'Подписчики');
        bot.sendMessage(chatId,"Выберите фильтры");
        break;
      case "Назад":
        goBack(chatId);
        break;
    }
});
