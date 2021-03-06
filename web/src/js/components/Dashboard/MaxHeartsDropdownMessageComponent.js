import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DashboardPopover from 'js/components/Dashboard/DashboardPopover'

const styles = {}

const MaxHeartsDropdownMessageComponent = props => {
  const { anchorElement, message } = props
  return (
    <DashboardPopover
      open={props.open}
      anchorEl={anchorElement}
      // Necessary to prevent the Modal component from stealing
      // hover away from the root element:
      // https://github.com/mui-org/material-ui/issues/14345#issuecomment-463919440
      // Could use Popper compnent as an alternative:
      // https://github.com/mui-org/material-ui/issues/9893#issuecomment-406891098
      style={{
        pointerEvents: 'none',
        marginTop: 6,
      }}
    >
      <div style={{ padding: 10, width: 210, textAlign: 'center' }}>
        <Typography variant={'body2'}>{message}</Typography>
      </div>
    </DashboardPopover>
  )
}

MaxHeartsDropdownMessageComponent.displayName =
  'MaxHeartsDropdownMessageComponent'

MaxHeartsDropdownMessageComponent.propTypes = {
  anchorElement: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  classes: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
}

MaxHeartsDropdownMessageComponent.defaultProps = {
  classes: {},
  open: false,
}

export default withStyles(styles)(MaxHeartsDropdownMessageComponent)
