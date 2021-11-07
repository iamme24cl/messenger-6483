import React from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    letterSpacing: -0.17,
    color: props => props.unreadCount > 0 ? "black" : "9CADC8",
    fontWeight: props => props.unreadCount > 0 ? "bold" : "normal",
  },
}));

const ChatContent = (props) => {
  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;
  const unreadCount = conversation.messages.filter(message => message.senderId === otherUser.id && message.readStatus === false).length;

  const styleProps = {unreadCount: unreadCount};
  const classes = useStyles(styleProps);
  
  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {unreadCount > 0 && <Badge badgeContent={unreadCount} color='primary' />}
    </Box>
  );
};

export default ChatContent;
