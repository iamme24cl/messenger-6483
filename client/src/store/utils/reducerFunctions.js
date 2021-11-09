export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadCount: 1
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.unreadCount = message.senderId === convo.otherUser.id ? convo.unreadCount +=1 : 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const updateUnreadMsgInStore = (state, payload) => {
 const { conversationId, senderId, reduceCount } = payload;

 return state.map((convo) => {
  if (convo.id === conversationId) {
    const convoCopy = { ...convo };

    let recipientLastReadId = -1;
    let senderLastReadId = -1;
    // Update readStatus of messages in convo whose senderId matches senderId
    convoCopy.messages = convoCopy.messages.map((msg) => {
      if (msg.senderId !== senderId && msg.readStatus === true) {
        recipientLastReadId = msg.id;
      }

      if (msg.senderId === senderId && msg.readStatus === false) {
        const msgCopy = { ... msg };
        msgCopy.readStatus = true;
        senderLastReadId = msgCopy.id;
        return msgCopy;
      } else {
        return msg;
      }
    });

    convoCopy.lastMsgReadId = reduceCount ? recipientLastReadId : senderLastReadId;
    const unreadCount = convo.messages.filter(message => (message.senderId === convo.otherUser.id && !message.readStatus)).length;
    return { ...convoCopy, unreadCount: unreadCount };
  } else {
    return convo;
  }
 });
};
