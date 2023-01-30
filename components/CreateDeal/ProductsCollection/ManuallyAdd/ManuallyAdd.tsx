import React, { useEffect, useState } from "react";
import {
    Card,
    Divider,
    FormControl,
    Grid,
    OutlinedInput,
    Typography,
} from "@mui/material";
import commonStyles from "../../Steps.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function ManuallyAdd() {

    const [MCHCounter, setMCHCounter] = useState<any>([]);

    const [LIAMCounter, setLIAMCounter] = useState<any>([]);

    const [showAllBtnMCH, setShowAllBtnMCH] = useState<Boolean>(false);

    const [showAllListMCH, setShowAllListMCH] = useState<Boolean>(false);

    const [showAllBtnLIAM, setShowAllBtnLIAM] = useState<Boolean>(false);

    const [showAllListLIAM, setShowAllListLIAM] = useState<Boolean>(false);

    const handleMCH = () => {
        setMCHCounter([...MCHCounter, { mch: "" }]);
    };

    const handleInputChange = (e: any, index: any) => {
        const { name, value } = e.target;
        const list = [...MCHCounter];
        list[index][name] = value;
        setMCHCounter(list);
    };

    const deleteMCH = (index: number) => {
        const rows = [...MCHCounter];
        rows.splice(index, 1);
        setMCHCounter(rows);
    }

    const handleLIAM = () => {
        setLIAMCounter([...LIAMCounter, { liam: "" }]);
    };

    const handleLiamInputChange = (e: any, index: any) => {
        const { name, value } = e.target;
        const list = [...LIAMCounter];
        list[index][name] = value;
        setLIAMCounter(list);
    }

    const deleteLIAM = (index: any) => {
        const rows = [...LIAMCounter];
        rows.splice(index, 1);
        setLIAMCounter(rows);
    }

    const handleShowAllMCH = () => {
        setShowAllListMCH(!showAllListMCH)
    }

    const handleShowAllLIAM = () => {
        setShowAllListLIAM(!showAllListLIAM)
    }

    useEffect(() => {
        if (MCHCounter.length > 5) {
            setShowAllBtnMCH(true)
        }

        if (LIAMCounter.length > 5) {
            setShowAllBtnLIAM(true)
        }

    }, [MCHCounter, LIAMCounter])

    return (
        <Grid>
            <Typography className={commonStyles.mchHeading}>MCH(s)</Typography>

            {MCHCounter.length > 0 ? (
                <>
                    <Typography>Products *</Typography>
                    <Typography>
                        Must be 9 characters beginning with the letter ‘M’
                    </Typography>
                </>
            ) : null}
            <Grid container mb={2}>
                {MCHCounter.slice(0, showAllListMCH ? MCHCounter.length : 5).map((data: any, index: any) => {
                    return (
                        <Grid container key={index} item lg={12} className={commonStyles["mch-card-container"]}>
                            <Grid item lg={11}>
                                <FormControl fullWidth>
                                    <OutlinedInput
                                        sx={{
                                            mt: 1,
                                            "&": {
                                                border: "1px solid #FFF",
                                                borderRadius: "4px",
                                            },
                                            "&.Mui-focused fieldset": {
                                                border: "1px solid #FFF",
                                            },
                                        }}
                                        placeholder="Enter a valid MCH"
                                        size="small"
                                        name="mch"
                                        value={data.mch}
                                        onChange={(e) => handleInputChange(e, index)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid>
                                {" "}
                                <CloseIcon onClick={() => deleteMCH(index)} className={commonStyles.closeIcon} />{" "}
                            </Grid>
                        </Grid>
                    );
                })}

                {showAllBtnMCH ?
                    <Grid mt={2} container display="grid" justifyContent="center">
                        {showAllListMCH ?
                            <Grid item lg={12}>
                                <Typography>Showing {MCHCounter.length} of {MCHCounter.length} recently added</Typography>
                                <Grid onClick={handleShowAllMCH} display="flex" ml={5}>
                                    <KeyboardArrowUpIcon /> <Typography ml={1}> Collapse</Typography>
                                </Grid>
                            </Grid>
                            :

                            <Grid item lg={12}>
                                <Typography>Showing 5 of {MCHCounter.length} recently added</Typography>
                                <Grid onClick={handleShowAllMCH} display="flex" ml={5}>
                                    <KeyboardArrowDownIcon /> <Typography ml={1}> Show all</Typography>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                    : null}
            </Grid>

            {MCHCounter.length < 1 ? (
                <Typography mb={2}>
                    There are currently no MCH(s) that have been added
                </Typography>
            ) : null}
            <Typography onClick={() => handleMCH()} className={commonStyles.addbtn}>
                <AddCircleOutlineIcon className={commonStyles.mchIcon} />
                Add MCH
            </Typography>
            <Divider sx={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}></Divider>

            <Typography className={commonStyles.mchHeading}>LIAM(s)</Typography>

            {LIAMCounter.length > 0 ? (
                <>
                    <Typography>Products *</Typography>
                    <Typography>
                        Must be 13 characters beginning with a letter
                    </Typography>
                </>
            ) : null}

            <Grid container mb={2}>
                {LIAMCounter.slice(0, showAllListLIAM ? LIAMCounter.length : 5).map((data: any, index: any) => {
                    return (
                        <Grid key={index} item lg={12} className={commonStyles["mch-card-container"]}>
                            <Grid item lg={11}>
                                <FormControl fullWidth>
                                    <OutlinedInput
                                        sx={{
                                            mt: 1,
                                            "&": {
                                                border: "1px solid #FFF",
                                                borderRadius: "4px",
                                            },
                                            "&.Mui-focused fieldset": {
                                                border: "1px solid #FFF",
                                            },
                                        }}
                                        placeholder="Enter a valid LIAM"
                                        size="small"
                                        name="liam"
                                        value={data.liam}
                                        onChange={(e) => handleLiamInputChange(e, index)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid>
                                {" "}
                                <CloseIcon onClick={() => deleteLIAM(index)} className={commonStyles.closeIcon} />{" "}
                            </Grid>
                        </Grid>
                    );
                })}

                {showAllBtnLIAM ?
                    <Grid mt={2} container display="grid" justifyContent="center">
                        {showAllListLIAM ?
                            <Grid item lg={12}>
                                <Typography>Showing {LIAMCounter.length} of {LIAMCounter.length} recently added</Typography>
                                <Grid onClick={handleShowAllLIAM} display="flex" ml={5}>
                                    <KeyboardArrowUpIcon /> <Typography ml={1}> Collapse</Typography>
                                </Grid>
                            </Grid>
                            :

                            <Grid item lg={12}>
                                <Typography>Showing 5 of {LIAMCounter.length} recently added</Typography>
                                <Grid onClick={handleShowAllLIAM} display="flex" ml={5}>
                                    <KeyboardArrowDownIcon /> <Typography ml={1}> Show all</Typography>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                    : null}

            </Grid>
            {LIAMCounter.length < 1 ?
                <Typography mb={2}>
                    There are currently no LIAM(s) that have been added
                </Typography>
                : null}
            <Typography
                onClick={() => handleLIAM()}
                className={commonStyles.addbtn}
            >
                <AddCircleOutlineIcon className={commonStyles.mchIcon} />
                Add LIAMs
            </Typography>
        </Grid>
    )
}

export default ManuallyAdd