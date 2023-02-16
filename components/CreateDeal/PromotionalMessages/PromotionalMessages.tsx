import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import FormCardPreview from "../../FormCardPreview";
import TextInputField from "../../FormComponents/TextInputField";
import StepLabel from "../../StepLabel";
import StepTitle from "../../StepTitle";
import commonStyles from "../Steps.module.css";
import styles from "./PromotionalMessages.module.css";
import UndoIcon from "@mui/icons-material/Undo";
import { useFormContext } from "react-hook-form";

function PromotionalMessages({ dealLevelName }: any) {
  const { resetField } = useFormContext();

  const handleResetClick = (fieldName: string) => {
    resetField(fieldName);
  };

  return (
    <Card className={commonStyles["step-card-container"]}>
      <StepLabel currentStep={dealLevelName === 'product' ? 7 : 6} totalSteps={dealLevelName === 'product' ? 7 : 6} />
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
          />
          <Box mt={5}>
            <FormCardPreview
              title="Customer preview"
              description="Preview will generate after inputs are completed"
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<UndoIcon />}
            className={styles["resetBtn"]}
            onClick={() => handleResetClick("englishMessage")}
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
        <Grid item lg={12}>
          <Typography variant="body2" className={styles["subtitle"]} mb={3}>
            French
          </Typography>
          <TextInputField
            title="Message"
            placeholder="eg. 20% Remise - Tu as economise 2"
            name="frenchMessage"
            regular
            required
          />
          <Box mt={5}>
            <FormCardPreview
              title="Customer preview"
              description="Preview will generate after inputs are completed"
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<UndoIcon />}
            className={styles["resetBtn"]}
            onClick={() => handleResetClick("frenchMessage")}
          >
            Reset to default
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}

export default PromotionalMessages;
