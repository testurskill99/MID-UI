// import './ToggleButtons.css'
import React from 'react';
import MuiToggleButton from "@mui/material/ToggleButton";
import { styled } from "@mui/material/styles";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { MdRebaseEdit } from 'react-icons/md';
import { FiZoomIn } from 'react-icons/fi';

function ToggleButtons(props) {

  // const [selectedItems, setSelectedItems] = useState(props?.selectedItems);

  const handleFormat = (event, newItems) => {
    event.stopPropagation()
    props?.handleToggle(newItems)
  }

  const ToggleButton = styled(MuiToggleButton)({
    "&.Mui-selected": {
      color: "white",
      backgroundColor: '#214c7f'
    },
    "&.Mui-selected:hover": {
      backgroundColor: '#193961'
    }
  });

  return (
    <ToggleButtonGroup
      exclusive
      value={props?.selectedItems}
      onChange={handleFormat}
      aria-label="text formatting"
      size="small"
    >
      <ToggleButton value="annotate" aria-label="annotate">
        {/* <MdRebaseEdit size={22} title="Annotate" /> */}
        Arrow Annotate
      </ToggleButton>
      <ToggleButton value="zoom" aria-label="zoom">
        {/* <FiZoomIn size={22} title="Zoom In/Out" /> */}
        Zoom
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default React.memo(ToggleButtons);
