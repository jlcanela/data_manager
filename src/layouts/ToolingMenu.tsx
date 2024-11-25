// Dans votre composant Tooling
import { List, ListItem, ListItemButton, ListItemText, Stack } from "@suid/material";
import { useNavigate, useLocation } from "@solidjs/router";
import PageHeader from "../components/PageHeader";
import { createMemo } from "solid-js";

export default function ToolingMenu(props) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: "BPMN", path: "/tooling/bpmn" },
        { text: "Forms", path: "/tooling/forms" },
        { text: "DMN", path: "/tooling/dmn" }
    ];

    const currentPath = createMemo(() => location.pathname);

    return (
        <div>
            <Stack direction="row" spacing={2}>
                <List sx={{ width: 240, bgcolor: 'background.paper' }}>
                    {menuItems.map((item) => (
                        <ListItem disablePadding>
                            <ListItemButton 
                                onClick={() => navigate(item.path)}
                                selected={currentPath() === item.path}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                    },
                                }}
                            >
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                
                <div style={{ flex: 1, padding: '20px' }}>
                    {props.children}
                </div>
            </Stack>
        </div>
    );
}
