import React, { useState, createContext, useContext, useEffect } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@/styles/globals.scss";
import styles from "@/styles/App.module.scss";
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import {
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ListsProvider } from "@/components/lists/ListsContext";
import { AlertsProvider } from "@/components/lists/AlertsContext";
import { ModalsProvider } from "@/components/lists/ModalsContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragStateProvider } from "@/components/drag-and-drop/DragStateContext";

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

const images = [
  'url("/neom-tuEtpjghVmg-unsplash.jpg")',
  'url("/amy-vann-GFsc977iFL4-unsplash.jpg")',
  'url("/chris-andrawes-pBpIYmktcGg-unsplash.jpg")',
  'url("/jigar-panchal-wZvqKPc05TM-unsplash.jpg")',
];

export const SidebarContext = createContext();

function MyApp({ Component, pageProps }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isSingleImage = images.length === 1;

  // Function to preload an image
  const preloadImage = (index) => {
    const img = new Image();
    img.src = images[index].slice(5, -2);
    return new Promise((resolve) => {
      img.onload = resolve;
    });
  };

  // Function to manually change to the next image
  const handleManualChange = async () => {
    if (isSingleImage) return; // Skip if only one image

    const nextIndex = (currentImageIndex + 1) % images.length;
    setIsImageLoaded(false); 
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for fade-out
    await preloadImage(nextIndex);
    setCurrentImageIndex(nextIndex);
    setIsImageLoaded(true); // Fade in the new image
  };

  useEffect(() => {
    // Preload the initial (or only) image and fade it in
    preloadImage(currentImageIndex).then(() => {
      setIsImageLoaded(true); // Fade in the image once it's loaded
    });

    if (isSingleImage) return; // Skip auto-rotation if only one image

    const changeImage = async () => {
      setIsImageLoaded(false); // Fade out the current image
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const nextIndex = (currentImageIndex + 1) % images.length;
      await preloadImage(nextIndex);
      setCurrentImageIndex(nextIndex);
      setIsImageLoaded(true); // Fade in the new image
    };

    const intervalId = setInterval(changeImage, 33000); // Change image every 33 seconds
    return () => clearInterval(intervalId);
  }, [currentImageIndex]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const containerClass = `${
    sidebarOpen
      ? styles.containerSidebarExpanded
      : styles.containerSidebarCompact
  }`;

  return (
    <DndProvider backend={HTML5Backend}>
      <DragStateProvider>
        <ModalsProvider>
          <AlertsProvider>
            <ListsProvider>
              <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
                {/* Background image container */}
                <div
                  className={styles.background}
                  style={{
                    backgroundImage: images[currentImageIndex],
                    opacity: isImageLoaded ? 1 : 0,
                    transition: "opacity 3s ease-in-out",
                  }}
                />
                <div className={styles.app}>
                  <div
                    className={
                      sidebarOpen
                        ? styles.headerSidebarExpanded
                        : styles.headerSidebarCompact
                    }
                  >
                    <Header />
                  </div>
                  <Sidebar
                    toggleSidebar={toggleSidebar}
                    sidebarOpen={sidebarOpen}
                  />
                  <div className={containerClass}>
                    <Component {...pageProps} />
                  </div>
                  {!isSingleImage && (
                    <button
                      onClick={handleManualChange}
                      style={{
                        zIndex: 1501,
                        position: "fixed",
                        top: 20,
                        right: 20,
                      }}
                    >
                    </button>
                  )}
                </div>
                <Box
                  sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1500 }}
                >
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
              </SidebarContext.Provider>
            </ListsProvider>
          </AlertsProvider>
        </ModalsProvider>
      </DragStateProvider>
    </DndProvider>
  );
}

export default MyApp;
