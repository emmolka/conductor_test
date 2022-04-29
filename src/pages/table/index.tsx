import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// import Login from "./pages/login";
import Table from "../../components/table";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";

import { Topic } from "../../types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const TablePage = (): JSX.Element => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopicTitle, setNewTopicTitle] = useState("");

  const [isOpened, setIsOpened] = useState(false);

  const getAllTopics = async () => {
    const { data } = await axios.get("http://localhost:3001/topics/");
    setTopics(data);
  };

  useEffect(() => {
    // listening to new topics
    const socket = io("ws://localhost:3001");
    socket.on("new topics", function (msg: Topic[]) {
      setTopics(msg);
    });
    return () => {
      socket.off();
    };
  }, []);

  const applyNewTopic = async (topicName: string) => {
    try {
      const { data } = await axios.post(
        `http://localhost:3001/topics/${topicName}`
      );
      setTopics(data);
      setIsOpened(false);
      setNewTopicTitle("");
    } catch (e) {
      alert(e);
    }
  };

  // const applyNewMessage = async (topicId: string, message: string) => {
  //   try {
  //     const { data } = await axios.post(
  //       `http://localhost:3001/topics/${topicId}/${message}`
  //     );
  //     console.log(data);
  //   } catch (e) {
  //     alert(e);
  //   }
  // };

  useEffect(() => {
    // applyNewMessage("d2b50ab0-106e-436e-bae7-373e8f4726f0", "new test msg"); //If you would like to test it out on some messages :) just pick some correct id
    getAllTopics();
  }, []);

  return (
    <TableContainer
      sx={{
        minWidth: 650,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
      component={Paper}
    >
      <Modal open={isOpened} onClose={() => setIsOpened(false)}>
        <Box sx={style}>
          <Input
            id="outlined-basic"
            placeholder="Type topics name"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
          />
          <Button
            sx={{ maxWidth: "100px", textTransform: "none" }}
            variant="contained"
            onClick={() => applyNewTopic(newTopicTitle)}
            disabled={!newTopicTitle}
          >
            Add topic
          </Button>
        </Box>
      </Modal>
      <Button
        sx={{ maxWidth: "100px", textTransform: "none" }}
        variant="contained"
        onClick={() => setIsOpened(true)}
      >
        New topic
      </Button>
      <Table topics={topics} />
    </TableContainer>
  );
};

export default TablePage;
