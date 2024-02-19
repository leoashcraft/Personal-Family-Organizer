import React from "react";
import * as Icons from "@mui/icons-material";

const RenderIcon = ({ iconName, style, onClick }) => {
  // Fetch the icon component based on the iconName
  const IconComponent = Icons[iconName];

  // Render the icon component if it exists, otherwise return null or a default icon
  return IconComponent ? (
    <IconComponent style={style} onClick={onClick} />
  ) : null;
};

export default RenderIcon;
