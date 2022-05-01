import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";

import { LangContext } from "../../hooks/provider";
import Table from "../../components/table";
import {
  Button,
  TableContainer,
  Paper,
  Modal,
  Input,
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

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
  // 0auth and language context data
  const { isAuthenticated, logout, loginWithRedirect, isLoading, user } =
    useAuth0();
  const { lang, currentLangData, switchLang } = useContext(LangContext);

  // internal state
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [isModalOpened, setIsModalOpened] = useState(false);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    if (newValue === "en-US" || newValue === "pl-PL") switchLang(newValue);
  };

  // logout all tabs
  const onStorageChange = async () => {
    const noTopicTitle = localStorage.getItem("topicTitle")
      ? localStorage.length <= 1
      : !localStorage.length;

    if (!isAuthenticated && noTopicTitle) {
      // it might not be perfect, however works :) probably there is a better solution, couldn't easily find
      return logout({ returnTo: window.location.origin });
    }

    return setNewTopicTitle(localStorage.getItem("topicTitle") || "");
  };

  const getAllTopics = async () => {
    // fetching all topics
    setTopicsLoading(true);
    try {
      const { data } = await axios.get("http://localhost:3001/topics/");
      setTopics(data);
    } catch (e) {
      setTopicsLoading(false);
      alert(e);
    } finally {
      setTopicsLoading(false);
    }
  };

  const applyNewTopic = async (topicName: string) => {
    try {
      setTopicsLoading(true);
      const { data } = await axios.post(
        `http://localhost:3001/topics/${topicName}`
      );
      setTopics(data);
      setIsModalOpened(false);
      setNewTopicTitle("");
      localStorage.setItem("topicTitle", "");
    } catch (e) {
      setTopicsLoading(false);
      alert(e);
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleTopicTitle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewTopicTitle(e.target.value);
    localStorage.setItem("topicTitle", e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("topicTitle");
    return logout({ returnTo: window.location.origin });
  };

  // const applyNewMessage = async (topicId: string, message: string) => {
  //   // for you to easily test
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
    // applyNewMessage("d2b50ab0-106e-436e-bae7-373e8f4726f0", "new test msg 123"); //If you would like to test it out on some messages :) just pick some correct id
    const socket = io("ws://localhost:3001");
    socket.on("new topics", function (msg: Topic[]) {
      setTopics(msg);
    });
    getAllTopics();
    window.addEventListener("storage", onStorageChange);
    return () => {
      window.removeEventListener("storage", onStorageChange);
      socket.off();
    };
  }, []);

  if (isLoading) {
    return <p>Loading ...</p>;
  }

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
      <Modal open={isModalOpened} onClose={() => setIsModalOpened(false)}>
        <Box sx={style}>
          <Input
            id="outlined-basic"
            placeholder="Type topics name"
            value={newTopicTitle}
            onChange={handleTopicTitle}
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
      {isAuthenticated ? (
        <>
          <Typography>Your awesome nickname: {user?.nickname}</Typography>
          <Button
            sx={{ maxWidth: "100px", textTransform: "none" }}
            variant="contained"
            onClick={handleLogout}
          >
            Log out
          </Button>
          <Button
            sx={{ maxWidth: "100px", textTransform: "none", marginTop: "10px" }}
            variant="contained"
            onClick={() => setIsModalOpened(true)}
          >
            New topic
          </Button>
          <Table topics={topics} topicsLoading={topicsLoading} />{" "}
        </>
      ) : (
        <>
          <Select value={lang} label="Language" onChange={handleLanguageChange}>
            <MenuItem value={"pl-PL"}>PL</MenuItem>
            <MenuItem value={"en-US"}>EN</MenuItem>
          </Select>
          <Button onClick={() => loginWithRedirect()}>Login/sign up</Button>
          <Typography
            onClick={() => {
              switchLang("pl-PL");
            }}
          >
            {currentLangData?.welcome}
          </Typography>
        </>
      )}
    </TableContainer>
  );
};

export default TablePage;
