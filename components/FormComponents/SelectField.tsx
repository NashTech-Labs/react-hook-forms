import React from 'react'
import { useFormContext, useController } from 'react-hook-form'
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FieldErrorMessage from '../FormComponents/FieldErrorMessage'
import styles from './FormComponents.module.css'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CustomTooltip from '../Tooltip'

interface ISelectFieldProps {
  title?: string
  options: { [index: string]: string }
  name: string
  required?: boolean
  inputHeight?: boolean
  dealCriteria?: boolean
  tooltipKey? : string
  topGutters?: boolean
}

const EmptyIconComponent = () => <div />

const SelectField = ({ options, name, required, title, inputHeight, dealCriteria, tooltipKey, topGutters }: ISelectFieldProps) => {
  const { control } = useFormContext()
  const { field, fieldState: { error } } = useController({
    control,
    name
  })
  const { onChange, onBlur, ref, value } = field
  const titleClassNames = []
  required && titleClassNames.push(styles['required'])

  return <FormControl className={dealCriteria ? styles["stack-type-form-control-deal-criteria"] : styles["stack-type-form-control"]} sx={{ marginTop: topGutters ? '20px' : '0px' }}>
    <div className={styles['title-container']}>
    <Typography variant="body1" gutterBottom className={titleClassNames.join(' ')}>
      {title}
    </Typography>
    {tooltipKey && <CustomTooltip descriptionKey={tooltipKey}/>}
    </div>
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
      className={dealCriteria ? styles["select-deal-criteria"] : styles["select"]}
      inputRef={ref}
      name={name}
      onBlur={onBlur}
      error={Boolean(error)}
      IconComponent={error ? EmptyIconComponent : ArrowDropDownIcon}
      endAdornment={<InputAdornment position="end" sx={{ marginRight: '5px' }}>
        {error && <>
          <ErrorOutlineIcon className={styles['select-error-icon']} />
          <ArrowDropDownIcon />
        </>}
      </InputAdornment>}
      sx={{
        width: '350px',
        '&.Mui-error': {
          background: '#FEFAF9'
        },
        '.MuiSelect-select': {
          color: value ? '#000000' : '#666B73'
        },
        height: inputHeight ? "40px" : "auto",
        "::placeholder": {
          color: '#666B73 !important',
          opacity: "1 !important",
          fontWeight: "400 !important ",
          fontSize: "16px !important",
          lineHeight: "120% !important",
        }
      }}
      data-testid={name}
      inputProps={{
        'data-testid': `${name}-input`
      }}
    >
      {Object.keys(options).map((key) => (
        <MenuItem key={key} value={key}>
          {options[key]}
        </MenuItem>
      ))}
    </Select>
    {error && <FieldErrorMessage message={error.message} testId={`${name}-field-error`} />}
  </FormControl>
}

export default SelectField