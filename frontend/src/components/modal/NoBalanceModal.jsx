import {  Divider, Modal, Stack } from "@mui/material";
import { useState } from "react";
import Text from "../Text";
import Button from "../Button";
import BuyCreditModal from "./BuyCreditModal";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: "2px 5px 5px #131C30",
  p: 4,
};

export default function NoBalanceModal({ open, setOpen }) {
  const handleClose = () => setOpen(false);
  const [buyCredit, setBuyCredit] = useState(false)
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack spacing={3} sx={style}>
          <Text
            fs="20px"
            fw="700"
            color="red"
            sx={{ textAlign: "center" }}
            id="modal-modal-title"
          >
            Low Balance
          </Text>
          <Divider />
          <Text
            fs="18px"
            fw="550"
            color="#131C30"
            sx={{ textAlign: "center" }}
            id="modal-modal-description"
          >
            You currently have a low credit balance. Please click on Buy Credit
            to buy additional credit
          </Text>

          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Button variant="outlined" onClick={handleClose} color="#131C30">
              Cancel
            </Button>

            <Button variant="contained" onClick={() => {handleClose(); setBuyCredit(true);}}>
              Buy Credit
            </Button>
          </Stack>
        </Stack>
      </Modal>
    <BuyCreditModal open={buyCredit} setOpen={setBuyCredit} />
    </>
  );
}

NoBalanceModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};
