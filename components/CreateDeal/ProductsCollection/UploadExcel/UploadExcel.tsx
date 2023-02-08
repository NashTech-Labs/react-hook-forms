import React, { useEffect, useRef, useState } from "react";
import { Grid, Typography } from "@mui/material";
import commonStyles from "../../Steps.module.css";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";
import { useController, useFormContext } from "react-hook-form";
import FieldErrorMessage from "../../../FormComponents/FieldErrorMessage";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function UploadExcel({ uploadStep }: any) {

    const { control, setError } = useFormContext()
    const { field, fieldState: { error } } = useController({
        control,
        name: uploadStep
    })
    const { onChange, onBlur } = field

    const [file, setFile] = useState<any>({});

    const hiddenFileInput = useRef<any>(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    const handleUpload = (evt: any) => {
        if (evt) {
            setFile(evt);

            let f = evt;
            const reader = new FileReader();
            reader.onload = async (evt: any) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: "binary" });

                const sheetName = wb.SheetNames[0];
                const worksheet = wb.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                console.log(json)
            };
            reader.readAsBinaryString(f);
        }
    };

    const handleDelete = (e: any) => {
        e.stopPropagation();
        setFile({});
    };

    let fileSelectEle: any = document.getElementById(uploadStep);

    const charge = () => {
        document.body.onfocus = function () { setTimeout(checkOnCancel, 100); };
    }

    useEffect(() => {
        charge();
    }, [fileSelectEle])

    const checkOnCancel = () => {
        if (fileSelectEle) {
            return
        }
        else {
            setError(uploadStep, { message: 'Error: File required' });
        }
        document.body.onfocus = null;
    }

    return (
        <>
            <Typography className={commonStyles.required} mt={2} mb="-2%">
                Collection
            </Typography>
            {error ?
                <>
                    <Grid
                        className={commonStyles["upload-card-error"]}
                        onClick={handleClick}
                        bgcolor="#FEFAF9"
                    >
                        <input
                            type="file"
                            key={file}
                            ref={hiddenFileInput}
                            id={uploadStep}
                            onChange={(evt: any) => { onChange(evt.target.files[0]); handleUpload(evt.target.files[0]) }}
                            onBlur={onBlur}
                            style={{ display: "none" }}
                        />
                        {(
                            <Grid
                                container
                                display="flex"
                                justifyContent="space-between"
                                mt={2}
                            >
                                <Grid item lg={6} display="flex">
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

                                <Grid>
                                    <ErrorOutlineIcon className={commonStyles['error-icon']} />
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </>
                :
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
                        id={uploadStep}
                        onChange={(evt: any) => { onChange(evt.target.files[0]); handleUpload(evt.target.files[0]) }}
                        onBlur={onBlur}
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
            }
            <Grid>
                {error && <FieldErrorMessage message={error.message} />}
            </Grid>
        </>
    )
}

export default UploadExcel