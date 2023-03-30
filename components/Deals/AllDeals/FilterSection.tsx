import React, { useState } from 'react'
import {useSelector} from "react-redux";
import Modal from "react-modal";
import {  Grid, Typography, Button } from "@mui/material";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import styles from "./FilterSection.module.css";
import FilterModal from './FilterModal'
import {getFilters} from "../../../store/feature/filters/filtersSlice";

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

const FilterSection = ({ }) => {
    const { count } = useSelector(getFilters)
    const [show, setShow] = useState(false)

    const openFilterModal = () => {
        setShow(true)
    }

    const closeModal = () => {
        setShow(false)
    }

 return <Grid container>
        <Grid item lg={6} md={6} sm={6} mt={6} sx= {{ mt: 3, mb: 3 }}>
            <Typography
            variant="h5"
            sx={{ mb: 3 }}
            className={styles["deal-card-header"]}
            >
            All
            </Typography>
    </Grid>
    <Grid item lg={6} md={6} sm={6} mt={6} sx= {{ mt: 3, mb: 3 }}>
        <div className={styles["filter-container"]}>
          <div className={styles["filter-label"]}>
            Filters:
          </div>
          <div className={styles["filter-field"]}>
            <Button
            variant='outlined'
            sx ={{
              border: '1px solid #CCCCCC',
              color: '#333333',
              padding: '2px 10px',
              textTransform: 'none',
              height: '35px'
            }}
            onClick = {openFilterModal}
            data-testId="filter-button"
            >
              <span className={styles['filter-icon']}>
               <FilterListOutlinedIcon/> 
              </span>
              <span>
               {`${count || 0} Applied`}
              </span>
            </Button>
          </div>
        </div>
        <Modal
          style={filterStyles}
          isOpen={show}
          onRequestClose={closeModal}
        >
            <FilterModal closeModal={closeModal}/>
        </Modal>
    </Grid>
</Grid>
}

export default FilterSection