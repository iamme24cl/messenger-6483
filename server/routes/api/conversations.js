const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      
      // find the id of the last message read by other user
      const lastMsgRead = convoJSON.messages.find(msg => msg.senderId === userId && msg.readStatus === true);
      convoJSON.lastMsgReadId = lastMsgRead ? lastMsgRead.id : -1;

      convoJSON.messages.reverse();
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.put('/:conversationId/unread-messages', async (req, res, next) => {
  try {

    if (!req.user) {
      return res.sendStatus(401);
    }
    
    const userId = req.user.id;
    const { user1Id, user2Id } = await Conversation.findByPk(req.params.conversationId);
    if (userId !== user1Id && userId !== user2Id) {
      return res.sendStatus(403);
    }

    await Message.update(
      {readStatus: true},
      {where: {
        conversationId: req.params.conversationId,
        senderId: req.body.senderId,
        readStatus: false
      }
    });
  } catch (error) {
    next(error);
  }
})


module.exports = router;
