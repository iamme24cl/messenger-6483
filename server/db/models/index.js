const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// associations

User.belongsToMany(Conversation, { through: 'ConversationsUsers' });
Conversation.belongsToMany(User, { through: 'ConversationsUsers' });

User.hasMany(Message);
Message.belongsTo(User);
Conversation.hasMany(Message);
Message.belongsTo(Conversation);



module.exports = {
  User,
  Conversation,
  Message
};
