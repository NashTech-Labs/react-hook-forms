import React, { useState } from 'react'
import { useSelector } from "react-redux";
import Modal from "react-modal";
import { Grid, Typography, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import styles from "./FilterSection.module.css";
import FilterVoucherModal from './FilterVoucherModal'
import { getVoucherFilters } from "../../store/feature/voucher/voucherFilterSlice";

const filterStyles = {
    content: {
        width: "40%",
        top: "40%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "2px",
        background: "#fff",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        padding: "16px",
        gap: "10px",
    },
    overlay: {
        zIndex: "999",
        background: "rgba(0,0,0,0.4",
    },
};

const FilterVoucherSection = ({ sortOption, handleSortOption}: any) => {
    const { count } = useSelector(getVoucherFilters)
    const [show, setShow] = useState(false)

    const openFilterModal = () => {
        setShow(true)
    }

    const closeModal = () => {
        setShow(false)
    }

    const handleChange = ({target: { value },
      }: SelectChangeEvent<string>) => {
        handleSortOption(value);
    }

    return <Grid container>
        <Grid item lg={6} md={6} sm={6} mt={6} sx={{ mt: 3, mb: 3 }}>
            <Typography
                variant="h5"
                sx={{ mb: 3 }}
                className={styles["deal-card-header"]}
            >
                All
            </Typography>
        </Grid>
        <Grid item lg={6} md={6} sm={6} mt={6} sx={{ mt: 3, mb: 3 }}>
            <div className={styles["filter-container"]}>
                <div>
                <div className={styles["filter-label"]}>
                    Filters:
                </div>
                <div className={styles["filter-field"]}>
                    <Button
                        variant='outlined'
                        sx={{
                            border: '1px solid #CCCCCC',
                            color: '#333333',
                            padding: '2px 10px',
                            textTransform: 'none',
                            height: '35px'
                        }}
                        onClick={openFilterModal}
                        data-testId="filter-button"
                    >
                        <span className={styles['filter-icon']}>
                            <FilterListOutlinedIcon />
                        </span>
                        <span>
                            {`${count || 0} Applied`}
                        </span>
                    </Button>
                </div>
            </div>

            {/* ++++++++++++++++++++++ */}
            <div>
            <div className={styles["filter-label"]}>
                    Sort By:
                </div>
                <div className={styles["filter-field"]}>
                    <FormControl>
                      <Select
                        value={sortOption}
                        // onChange={handleChange}
                        displayEmpty
                        className={styles.dropdownSection}
                        sx={{
                          ".MuiSvgIcon-root ": {
                            fill: "#000 !important",
                          },
                        }}
                      >
                        <MenuItem value={"MOST_RECENT"}>Most recent</MenuItem>
                        <MenuItem value={"ALPHABETICAL"}>Alphabetical</MenuItem>
                      </Select>
                    </FormControl>
                </div>
                </div>
            </div>
                {/* ++++++++++++++++++++++ */}
            <Modal
                style={filterStyles}
                isOpen={show}
                onRequestClose={closeModal}
            >
                <FilterVoucherModal closeModal={closeModal} />
            </Modal>
        </Grid>
    </Grid>
}

export default FilterVoucherSection