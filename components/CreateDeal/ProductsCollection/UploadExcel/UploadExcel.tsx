import React, { useRef, useState } from "react";
import { Grid, Typography } from "@mui/material";
import commonStyles from "../../Steps.module.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";

function UploadExcel() {

    const [file, setFile] = useState<any>({});

    const hiddenFileInput = useRef<any>(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const handleUpload = (evt: any) => {
        if (evt && evt.target.files[0]?.size < 10000000) {
            setFile(evt.target.files[0]);

            let f = evt.target.files[0];
            const reader = new FileReader();
            reader.onload = async (evt: any) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: "binary" });

                const sheetName = wb.SheetNames[0];
                const worksheet = wb.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
            };
            reader.readAsBinaryString(f);
        }
    };

    const handleDelete = (e: any) => {
        e.stopPropagation();
        setFile({});
    };

    return (
        <>
            <Typography mt={2} mb="-2%">
                Collection
            </Typography>
            <Grid
                className={
                    file?.name
                        ? commonStyles["upload-filled-card-container"]
                        : commonStyles["upload-card-container"]
                }
                onClick={handleClick}
                bgcolor={file?.name ? "#F2FAEA" : "#FFF"}
            >
                <input
                    type="file"
                    key={file}
                    ref={hiddenFileInput}
                    onChange={(event) => handleUpload(event)}
                    style={{ display: "none" }}
                />
                {file?.name ? (
                    <Grid
                        container
                        display="flex"
                        justifyContent="space-between"
                        mt={2}
                    >
                        <Grid item lg={6} display="flex">
                            <TaskOutlinedIcon className={commonStyles.uploadTask} />
                            <Grid className={commonStyles.dealTitle}>
                                <Typography mb={1} className={commonStyles.uploadTitle}>
                                    {file?.name}
                                </Typography>
                                <Typography>{(file?.size / 1000).toFixed(1)} KB</Typography>
                            </Grid>
                        </Grid>

                        <Grid>
                            {" "}
                            <CloseIcon onClick={(e) => handleDelete(e)} />{" "}
                        </Grid>
                    </Grid>
                ) : (
                    <Grid display="flex" alignItems="center" mt={2}>
                        <UploadFileIcon className={commonStyles.uploadIcon} />
                        <Grid className={commonStyles.dealTitle}>
                            <Typography mb={1} className={commonStyles.uploadTitle}>
                                Upload collection
                            </Typography>
                            <Typography className={commonStyles.fileWarning}>
                                Must be a .XCEL with 1MB max
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </>
    )
}

export default UploadExcel