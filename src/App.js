import React from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import AlbumList from "./components/AlbumList";
import RecentAlbums from "./components/RecentAlbums";
import { useTheme } from "./context/ThemeContext";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { lightTheme, darkTheme } from "./themes";

// Global Stiller
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    margin: 0;
    font-family: Arial, sans-serif;
  }
`;

const Header = styled.div`
  text-align: center;
  padding: 20px;
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.tableHeaderText};
  position: relative;
`;

const HeaderTitle = styled.h1`
  margin: 0;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.tableHeaderText};
`;


const App = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const theme = isDarkMode ? darkTheme : lightTheme;


    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: '100vh' }}>
                <GlobalStyle />
                <Header>
                    <HeaderTitle>Albums</HeaderTitle>
                    <ToggleButton onClick={toggleTheme}>
                        {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                    </ToggleButton>
                </Header>
                <AlbumList />
                <RecentAlbums />
            </div>
        </ThemeProvider>
    );
};

export default App;
