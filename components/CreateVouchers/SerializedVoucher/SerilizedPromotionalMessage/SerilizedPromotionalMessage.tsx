import { Button, Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import styles from "./PromotionalMessages.module.css";
import UndoIcon from "@mui/icons-material/Undo";
import { useFormContext, useWatch } from "react-hook-form";
import StepperCard from "../../../CreateDeal/StepperCard";
import TextInputField from "../../../FormComponents/TextInputField";
import StepLabel from "../../../StepLabel";
import StepTitle from "../../../StepTitle";
import FormCardPreview from "../../../FormCardPreview";

interface ISerializedVoucherValueProps {
  currentStep: number;
  totalSteps: number;
}

function SerilizedPromotionalMessage({currentStep,totalSteps}: ISerializedVoucherValueProps) {
  const { resetField } = useFormContext();

  const englishMessage = useWatch({
    name: "englishMessage",
  });

  const frenchMessage = useWatch({
    name: "frenchMessage"
  })

  let englishDesc = null;
  let frenchDesc = null;

  if (englishMessage) {
    englishDesc = englishMessage
  } else {
    englishDesc = "Preview will generate after inputs are completed"
  }

  if (frenchMessage) {
    frenchDesc = frenchMessage
  } else {
    frenchDesc = "Preview will generate after inputs are completed"
  }

  const handleResetClick = (fieldName: string) => {
    resetField(fieldName);
  };

  return (
    <StepperCard step={'PROMOTION_MESSAGES'} inProgressIcon={MessageOutlinedIcon}>
      <StepLabel currentStep={currentStep} totalSteps={totalSteps} />
      <StepTitle title={"Promotional Messages"} />
      <Grid container>
        <Grid item lg={12}>
          <Typography variant="body2" className={styles["subtitle"]} my={3}>
            English
          </Typography>
            <TextInputField
              title="Message"
              placeholder="eg. 20% discount - You have saved 2"
              name="englishMessage"
              regular
              required
              inputHeight={true}
              tooltipKey={'ENGLISH_PROMOTION'}
            />
          <Box mt={5}>
            <FormCardPreview
              title="Customer preview"
              description={englishDesc}
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<UndoIcon />}
            className={styles["resetBtn"]}
            onClick={() => handleResetClick("englishMessage")}
            data-testid="englishMsgReset"
          >
            Reset to default
          </Button>
          <Divider
            sx={{
              border: "1px solid rgba(0, 0, 0, 0.25)",
              width: "100%",
              mt: 2,
              mb: 4,
            }}
          ></Divider>
        </Grid>
        <Grid item lg={12} alignItems="center">
          <Typography variant="body2" className={styles["subtitle"]} mb={3}>
            French
          </Typography>
          <TextInputField
            title="Message"
            placeholder="eg. 20% Remise - Tu as economise 2"
            name="frenchMessage"
            regular
            required
            inputHeight={true}
            tooltipKey={'FRENCH_PROMOTION'}
          />
          <Box mt={5}>
            <FormCardPreview
              title="Customer preview"
              description={frenchDesc}
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<UndoIcon />}
            className={styles["resetBtn"]}
            onClick={() => handleResetClick("frenchMessage")}
            data-testid="frenchMsgReset"
          >
            Reset to default
          </Button>
        </Grid>
      </Grid>
    </StepperCard>
  );
}

export default SerilizedPromotionalMessage;
