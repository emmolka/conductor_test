import { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { TopicsTableProps, Topic } from "../../types";
import ModalComponent from "../modal";

const TopicsTable = ({ topics }: TopicsTableProps): JSX.Element => {
  const [openedTopic, setOpenedTopic] = useState<Topic>();

  return (
    <TableContainer
      sx={{ minWidth: 650, display: "flex", justifyContent: "center" }}
      component={Paper}
    >
      <Table sx={{ minWidth: 650, maxWidth: 750 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Topic name</TableCell>
            <TableCell align="right">RF</TableCell>
            <TableCell align="right">Particion</TableCell>
            <TableCell align="right">Spread</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ModalComponent
            topicId={openedTopic?.id}
            isOpened={openedTopic !== undefined}
            topicTitle={openedTopic?.name}
            onClose={() => {
              // console.log(openedTopic, id);
              setOpenedTopic(undefined);
            }}
            loading={false}
            topicMessages={openedTopic?.messages || []}
          />
          {!!topics.length &&
            topics.map((topic) => {
              const { name, id, spread, rf, particion } = topic;
              return (
                <TableRow
                  key={id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#eee",
                    },
                  }}
                  onClick={() => setOpenedTopic(topic)}
                >
                  <TableCell component="th" scope="row">
                    {name}
                  </TableCell>
                  <TableCell align="right">{rf}</TableCell>
                  <TableCell align="right">{particion}</TableCell>
                  <TableCell align="right">{spread}%</TableCell>
                </TableRow>
              );
            })}
          {!topics.length && "No topics yet"}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TopicsTable;
