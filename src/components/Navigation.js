import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Menu,
    MenuItem,
} from '@mui/material';

import { grey } from '@mui/material/colors';
import Questions from '../pages/questions/Questions';
import Words from '../pages/vacbluary/Words'; // Подставьте путь к вашим компонентам
import Gram1 from '../pages/poliglot/Gram1'; // Подставьте путь к вашим компонентам
import Reader from "../pages/reader/Reader" ;   


const Navigation = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
      
       <Router>
            <AppBar position="static" sx={{ backgroundColor: grey[800] }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                           
                        </Typography>
                        <Button color="inherit" onClick={handleMenuOpen}>
                            Меню
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose} component={Link} to="/">
                                Слова
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose} component={Link} to="/about">
                                Полиглот
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose} component={Link} to="/Questions">
                                Вопросительные слова
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose} component={Link} to="/Reader">
                            Reader
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                <Routes>
                    <Route path="/" element={<Words />} />
                    <Route path="/about" element={<Gram1 />} />
                    <Route path="/contact" element={<Words />} />
                    <Route path="/Questions" element={<Questions />} />
                    <Route path="/Reader" element={<Reader />} />
                
                </Routes>
        </Router>
        

    );
};

export default Navigation;