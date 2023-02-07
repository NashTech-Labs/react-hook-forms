import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import commonStyles from "../../Steps.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ManualAddForm from "../../../FormComponents/ManualAddForm";
import { useFormContext, useWatch } from "react-hook-form";

function ManuallyAddLiam({ liamValue }: any) {

    const { control, setValue } = useFormContext()
    const liam = useWatch({
        control,
        name: liamValue
    })

    const [showAllBtnLIAM, setShowAllBtnLIAM] = useState<Boolean>(false);

    const [showAllListLIAM, setShowAllListLIAM] = useState<Boolean>(false);

    const handleLIAM = () => {
        liam.push('')
        setValue(liamValue, liam)
    };

    const deleteLIAM = (index: any) => {
        liam.splice(index, 1)
        setValue(liamValue, liam)
    }

    const handleShowAllLIAM = () => {
        setShowAllListLIAM(!showAllListLIAM)
    }

    useEffect(() => {
        if (liam.length > 5) {
            setShowAllBtnLIAM(true)
        }
        else {
            setShowAllBtnLIAM(false)
        }

    }, [liam])


    return (
        <>
            <Typography className={commonStyles.mchHeading}>LIAM(s)</Typography>

            {
                liam.length > 0 ? (
                    <>
                        <Typography className={commonStyles.required}>Products</Typography>
                        <Typography>
                            Must be 13 characters beginning with a letter
                        </Typography>
                    </>
                ) : null
            }

            <Grid container mb={2}>
                {liam.slice(0, showAllListLIAM ? liam.length : 5).map((data: any, index: any) => {
                    return (
                        <Grid key={index} item lg={12} className={commonStyles["mch-card-container"]}>
                            <Grid item lg={11}>
                                <ManualAddForm name={`${liamValue}.${index}`} placeholder="Enter a valid LIAM" />
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
                                <Typography>Showing <strong> {liam.length} of {liam.length} </strong> recently added</Typography>
                                <Grid onClick={handleShowAllLIAM} display="flex" ml={5}>
                                    <KeyboardArrowUpIcon /> <Typography ml={1}> Collapse</Typography>
                                </Grid>
                            </Grid>
                            :

                            <Grid item lg={12}>
                                <Typography>Showing <strong>5 of {liam.length} </strong> recently added</Typography>
                                <Grid onClick={handleShowAllLIAM} display="flex" ml={5}>
                                    <KeyboardArrowDownIcon /> <Typography ml={1}> Show all</Typography>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                    : null}

            </Grid>
            {
                liam.length < 1 ?
                    <Typography mb={2}>
                        There are currently no LIAM(s) that have been added
                    </Typography>
                    : null
            }

            <Grid container>
                <Grid item lg={2} onClick={() => handleLIAM()} className={commonStyles.addbtn}>
                    <AddCircleOutlineIcon className={commonStyles.mchIcon} />
                    <Typography ml="3px" mt="1px">
                        Add LIAMs
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
}

export default ManuallyAddLiam