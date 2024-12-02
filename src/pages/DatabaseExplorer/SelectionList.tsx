import DraftsIcon from "@suid/icons-material/Drafts";
import InboxIcon from "@suid/icons-material/Inbox";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@suid/material";
import useTheme from "@suid/material/styles/useTheme";

import { Checkbox} from "@suid/material";

interface SelectionListProps {
  items: string[];
  selected: Set<string>;
  toggle: (schema: string) => void;
  multiSelect?: boolean;
}

export default function SelectionList(props: SelectionListProps) {

  return (
    <List sx={{ width: '100%', maxWidth: 200, bgcolor: 'background.paper' }}>
      {props.items.map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem                   
            disablePadding
          >
            <ListItemButton dense onClick={() => props.toggle(value)}>
              <ListItemIcon>
                { props.multiSelect && <Checkbox
                  edge="start"
                  checked={props.selected.has(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />}
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}




export function BasicList() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DraftsIcon />
              </ListItemIcon>
              <ListItemText primary="Drafts" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Trash" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton<"a">
              component="a"
              href="#simple-list"
              target="none"
              onClick={(event) => event.preventDefault()}
            >
              <ListItemText primary="Spam" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
