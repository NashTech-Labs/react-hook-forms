import React from 'react'
import {useFormContext, useController} from 'react-hook-form'
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from '@mui/material/InputAdornment'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FieldErrorMessage from '../FormComponents/FieldErrorMessage'
import styles from './FormComponents.module.css'

interface ISelectFieldProps {
    options: {[index: string]: string}
    name: string
}

const EmptyIconComponent = () => <div/>

const SelectField = ({ options, name }: ISelectFieldProps) => {
    const {control } = useFormContext()
    const {field, fieldState : {error}} = useController({
      control,
      name
    })
    const {onChange, onBlur, ref, value} = field

 return <FormControl className={styles["stack-type-form-control"]}>
 <Select
   labelId="statcking-type-select"
   id={name}
   value={value}
   size="small"
   onChange={onChange}
   displayEmpty
   renderValue={(value) =>
     value ? options[String(value)] : "Select Type"
   }
   className={styles["select"]}
   inputRef={ref}
   name={name}
   onBlur={onBlur}
   error={Boolean(error)}
   IconComponent={error ? EmptyIconComponent : ArrowDropDownIcon}
   endAdornment={<InputAdornment position="end">
   {error && <InfoOutlinedIcon className={styles['select-error-icon']}/>}
   </InputAdornment>}
               sx={{
                 width: '350px',
                 '&.Mui-error':{
                     background: '#FEFAF9'
                 }
             }}
 >
   {Object.keys(options).map((key) => (
     <MenuItem key={key} value={key}>
       {options[key]}
     </MenuItem>
   ))}
 </Select>
{error && <FieldErrorMessage message={error.message}/>}
</FormControl>
}

export default SelectField