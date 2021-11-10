const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// associations

User.belongsTo(Conversation);
Conversation.hasMany(User);
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message
};
