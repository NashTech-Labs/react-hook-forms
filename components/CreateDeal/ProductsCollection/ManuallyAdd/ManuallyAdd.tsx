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
import ManualAddForm from "../../../FormComponents/ManualAddForm";
import { useFormContext, useWatch } from "react-hook-form";
import ManuallyAddLiam from "./ManuallyAddLiam";

function ManuallyAdd({ mchValue, liamValue }: any) {
    const { control, setValue } = useFormContext()
    const mch = useWatch({
        control,
        name: mchValue
    })

    const [showAllBtnMCH, setShowAllBtnMCH] = useState<Boolean>(false);

    const [showAllListMCH, setShowAllListMCH] = useState<Boolean>(false);

    const handleMCH = () => {
        mch.push('')
        setValue(mchValue, mch)
    };

    const deleteMCH = (index: number) => {
        mch.splice(index, 1)
        setValue(mchValue, mch)
    }

    const handleShowAllMCH = () => {
        setShowAllListMCH(!showAllListMCH)
    }

    useEffect(() => {
        if (mch.length > 5) {
            setShowAllBtnMCH(true)
        }

    }, [mch])

    return (
        <Grid>
            <Typography className={commonStyles.mchHeading}>MCH(s)</Typography>

            {mch.length > 0 ? (
                <>
                    <Typography>Products *</Typography>
                    <Typography>
                        Must be 9 characters beginning with the letter ‘M’
                    </Typography>
                </>
            ) : null}
            <Grid container mb={2}>
                {mch.slice(0, showAllListMCH ? mch.length : 5).map((data: any, index: any) => {
                    return (
                        <Grid container key={index} item lg={12} className={commonStyles["mch-card-container"]}>
                            <Grid item lg={11}>
                                <ManualAddForm name={`${mchValue}.${index}`} placeholder="Enter a valid MCH" />
                            </Grid>
                            <Grid>
                                <CloseIcon onClick={() => deleteMCH(index)} className={commonStyles.closeIcon} />{" "}
                            </Grid>
                        </Grid>
                    );
                })}

                {showAllBtnMCH ?
                    <Grid mt={2} container display="grid" justifyContent="center">
                        {showAllListMCH ?
                            <Grid item lg={12}>
                                <Typography>Showing {mch.length} of {mch.length} recently added</Typography>
                                <Grid onClick={handleShowAllMCH} display="flex" ml={5}>
                                    <KeyboardArrowUpIcon /> <Typography ml={1}> Collapse</Typography>
                                </Grid>
                            </Grid>
                            :

                            <Grid item lg={12}>
                                <Typography>Showing 5 of {mch.length} recently added</Typography>
                                <Grid onClick={handleShowAllMCH} display="flex" ml={5}>
                                    <KeyboardArrowDownIcon /> <Typography ml={1}> Show all</Typography>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                    : null}
            </Grid>

            {mch.length < 1 ? (
                <Typography mb={2}>
                    There are currently no MCH(s) that have been added
                </Typography>
            ) : null}
            <Typography onClick={() => handleMCH()} className={commonStyles.addbtn}>
                <AddCircleOutlineIcon className={commonStyles.mchIcon} />
                Add MCH
            </Typography>
            <Divider sx={{ border: "1px solid rgba(0, 0, 0, 0.25)" }}></Divider>

            <ManuallyAddLiam liamValue={liamValue} />

        </Grid>
    )
}

export default ManuallyAdd