import React from 'react'
import PropTypes from 'prop-types'
import { QueryRenderer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import environment from 'js/relay-env'
import SettingsChildWrapper from 'js/components/Settings/SettingsChildWrapperComponent'
import Account from 'js/components/Settings/Account/AccountContainer'
import ErrorMessage from 'js/components/General/ErrorMessage'
import logger from 'js/utils/logger'

class AccountView extends React.Component {
  render() {
    const { authUser } = this.props
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <QueryRenderer
          environment={environment}
          query={graphql`
            query AccountViewQuery($userId: String!) {
              user(userId: $userId) {
                ...AccountContainer_user
              }
            }
          `}
          variables={{
            userId: authUser.id,
          }}
          render={({ error, props }) => {
            if (error) {
              logger.error(error)
              const errMsg = 'We had a problem loading your account :('
              return <ErrorMessage message={errMsg} />
            }
            const showError = this.props.showError
            const dataLoaded = !!props
            return (
              <SettingsChildWrapper loaded={dataLoaded}>
                {dataLoaded ? (
                  <Account user={props.user} showError={showError} />
                ) : null}
              </SettingsChildWrapper>
            )
          }}
        />
      </div>
    )
  }
}

AccountView.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  showError: PropTypes.func.isRequired,
}

AccountView.defaultProps = {}

export default AccountView
