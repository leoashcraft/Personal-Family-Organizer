import React, { useContext, useState } from "react";
import { Box, FormControl, IconButton, InputAdornment, Popover, Paper, TextField, Tooltip } from "@mui/material";
import { FixedSizeList as List } from 'react-window';
import * as Icons from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import styles from "@/styles/Modals.module.scss";
import { useModals } from "@/components/lists/ModalsContext";

const iconsList = Object.keys(Icons).map(key => {
  const Icon = Icons[key];
  return { name: key, component: <Icon /> };
});

const iconsPerRow = 5;

function IconSelectorPopover() {

  const {
    isModalOpenIconSelector,
    iconAnchor,
    handleCloseModalIconSelector,
    handleIconSelect
  } = useModals();

  const [search, setSearch] = useState('');

  const onIconClick = (iconName) => {
    handleIconSelect(iconName);
  };

  const isFilledIcon = (iconName) => {
    return !(/Outlined|Rounded|TwoTone|Sharp$/).test(iconName);
  };

  const iconsList = Object.keys(Icons).filter(isFilledIcon).map(key => {
    const Icon = Icons[key];
    return { name: key, component: <Icon /> };
  });

  const filteredIconsList = iconsList.filter(icon =>
    icon.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderRow = ({ index, style }) => {
    const iconsForRow = [];
    for (let i = index * iconsPerRow; i < (index + 1) * iconsPerRow && i < filteredIconsList.length; i++) {
      const iconName = filteredIconsList[i].name;
      const Icon = Icons[iconName];
      iconsForRow.push(
        <Box key={i} style={{ padding: 10 }}>
          <Tooltip title={iconName} arrow>
            <IconButton onClick={() => onIconClick(iconName)} aria-label={iconName}>
              <Icon />
            </IconButton>
          </Tooltip>
        </Box>
      );
    }

    return (
      <div style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {iconsForRow}
      </div>
    );
  };

  return (
    <Popover
      open={isModalOpenIconSelector}
      anchorEl={iconAnchor}
      onClose={handleCloseModalIconSelector}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Paper className={styles.popoverContainer}>
        <FormControl fullWidth>
        <TextField
            label="Search Icons"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ margin: '20px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {search && (
                    <IconButton
                      onClick={() => setSearch('')}
                      edge="end"
                      aria-label="clear search"
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
          <List
            height={350}
            width={350}
            itemSize={50}
            itemCount={Math.ceil(filteredIconsList.length / iconsPerRow)}
          >
            {renderRow}
          </List>
        </FormControl>
      </Paper>
    </Popover>
  );
}

export default IconSelectorPopover;