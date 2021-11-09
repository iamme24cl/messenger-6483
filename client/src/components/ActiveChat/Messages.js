import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId, lastMsgReadId } = props;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        let lastMsgRead = lastMsgReadId === message.id ? true : false;

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} otherUser={otherUser} lastMsgRead={lastMsgRead} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
