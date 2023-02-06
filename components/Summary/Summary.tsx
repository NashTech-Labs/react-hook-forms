import { Card, Grid, Typography } from "@mui/material";
import React from "react";
import StepTitle from "../StepTitle";
import styles from "./Summary.module.css";

function Summary() {
    return (
        <Grid>
            <Card className={styles["step-card-container"]}>
                <StepTitle title={"Deal type"} />
                <Typography variant="h4" className={styles.heading} mt={4}>Type</Typography>
                <Typography>Discount</Typography>
            </Card>

            <Card className={styles["step-card-container"]}>
                <StepTitle title={"General information"} />

                <Grid container>
                    <Grid item lg={12} md={9} sm={6} display="flex">
                        <Grid item lg={7}>
                            <Typography variant="h4" className={styles.heading} mt={4} mb={1}>
                                Title
                            </Typography>
                            <Typography className={styles.content} >WK49 Spring Coll. 20% Off</Typography>

                            <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                Description
                            </Typography>
                            <Typography className={styles.content} >WK49 Spring Coll. 20% Off</Typography>

                            <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                Identifier
                            </Typography>
                            <Typography className={styles.content}>2935LD-KJ232</Typography>

                            <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                Priority
                            </Typography>
                            <Typography className={styles.content}>2935LD-KJ232</Typography>

                            <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                Stacking type
                            </Typography>
                            <Typography className={styles.content}>2935LD-KJ232</Typography>
                        </Grid>
                        <Grid mt={3}>
                            <Typography>Media</Typography>
                            <img
                                className={styles.img}
                                src="https://thumbs.dreamstime.com/b/beauty-brunette-model-girl-perfect-makeup-trendy-accessories-fashion-wear-88929334.jpg"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Card>


            <Card className={styles["step-card-container"]}>
                <StepTitle title={"Deal value"} />

                <Grid container>
                    <Grid item lg={12} md={9} sm={6}>
                        <Grid item lg={7}>
                            <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                Is this at a basket level or product level?
                            </Typography>
                            <Typography className={styles.content} >Product</Typography>

                            <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                Type
                            </Typography>
                            <Typography className={styles.content} >Percentage (%) off</Typography>

                            <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                Value
                            </Typography>
                            <Typography className={styles.content}>10%</Typography>

                            <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                Customer preview
                            </Typography>
                            <Typography className={styles.content}>10% off product(s)</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>

            <Card className={styles["step-card-container"]}>
                <StepTitle title={"Date in effect"} />

                <Grid container>
                    <Grid item lg={12} md={9} sm={6}>
                        <Grid item lg={7}>
                            <Typography variant="h5" className={styles.heading} mt={4} mb={1}>
                                Start Date
                            </Typography>
                            <Typography className={styles.content} >March 12, 2023  12:00pm EST</Typography>

                            <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                End Date
                            </Typography>
                            <Typography className={styles.content} >March 12, 2023  12:00pm EST</Typography>

                            <Typography variant="h4" className={styles.heading} mt={2} mb={1}>
                                Customer preview
                            </Typography>
                            <Typography className={styles.content}>Starts March 1 (7:00 AM EST) and ends March 7 (4:00 PM EST)</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>

        </Grid>
    );
}

export default Summary;
