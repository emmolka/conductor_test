import { useEffect, useState } from "react";

import { io } from "socket.io-client";

import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { ModalComponentProps, Message } from "../../types";

const boxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "#fff",
  border: "2px solid #fff",
  boxShadow: 24,
  p: 4,
};

const ModalComponent = ({
  isOpened,
  onClose,
  topicId,
  topicTitle,
  topicMessages,
}: ModalComponentProps): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>(topicMessages);

  useEffect(() => {
    // listening to new topics
    const socket = io("ws://localhost:3001");
    socket.on("new topic messages", function (msg: Message[]) {
      setMessages(msg);
    });
    return () => {
      socket.off();
    };
  }, [topicId]);

  useEffect(() => {
    // getting initial messages
    setMessages(topicMessages);
  }, [topicMessages]);

  return (
    <Modal open={isOpened} onClose={onClose}>
      <Box sx={boxStyle}>
        <Typography fontSize="20px">{topicTitle}</Typography>
        {messages?.map(({ message, id }) => (
          <Typography key={id} fontSize="16px">
            {message}
          </Typography>
        ))}
      </Box>
    </Modal>
  );
};

export default ModalComponent;
