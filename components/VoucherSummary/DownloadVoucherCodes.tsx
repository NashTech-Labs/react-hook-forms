import React from "react";
import { Card, Typography, Box, Button, LinearProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import styles from "../Summary/Summary.module.css";
import downloadStyles from "./DownloadVoucherCodes.module.css";
import { useLazyDownloadVoucherQuery } from "../../api/downloadVouchers";
import { notifyError } from "../../util/Notification/Notification";

const DownloadVoucherCodes = ({
  voucherId,
  downloadBatchIds,
  progress,
  total,
}: {
  voucherId: string;
  downloadBatchIds: Array<number>;
  progress: number;
  total: number;
}) => {
  const [download] = useLazyDownloadVoucherQuery();
  const handleDownload = async () => {
    const { data } = await download({
      batchIds: downloadBatchIds,
      voucherId,
    });
    if (data.error) {
      notifyError(
        "Failed to download Voucher codes",
        "voucher-download-failed"
      );
      return;
    }
    let csvString = Array.isArray(data)
      ? data.reduce((acc, cur) => `${acc}\n${cur}`)
      : "";
    csvString = "data:application/csv," + encodeURIComponent(csvString);
    const el = document.createElement("A");
    el.setAttribute("href", csvString);
    el.setAttribute("download", "vouchers.csv");
    document.body.appendChild(el);
    el.click();
  };
  return (
    <Card className={styles["step-card-container"]}>
      <Typography className={downloadStyles["title"]}>
        Number of vouchers
      </Typography>
      <Typography className={downloadStyles["count"]}>{total}</Typography>
      {progress !== 100 ? (
        <Box
          sx={{
            marginTop: "40px",
          }}
        >
          <Typography className={downloadStyles["success-message"]}>
            Please wait as the serialized vouchers load.
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ marginY: "20px" }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            marginTop: "40px",
          }}
        >
          <Typography className={downloadStyles["success-message"]}>
            You successfully created {total} codes on 01/12/23
          </Typography>
          <Button
            className={styles.downloadButton}
            variant="contained"
            onClick={handleDownload}
          >
            <DownloadIcon sx={{ marginRight: "10px" }} fontSize="small" />
            Download .CSV
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default DownloadVoucherCodes;
