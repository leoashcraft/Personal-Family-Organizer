import * as React from "react";
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import {
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Share as ShareIcon,
} from "@mui/icons-material";

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

function SpeedDialMenu() {
  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1500 }}>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
export default SpeedDialMenu;
