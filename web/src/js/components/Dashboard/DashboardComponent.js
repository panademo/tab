/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import VcUser from '../User/VcUserContainer';
import UserDisplay from '../User/UserDisplayContainer';
import UserBackgroundImage from '../User/UserBackgroundImageContainer';
import BackgroundImagePickerContainer from '../BackgroundImage/BackgroundImagePickerContainer';
import DonateVcContainer from '../Donate/DonateVcContainer';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import {
	deepPurple500
} from 'material-ui/styles/colors';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      bkgSelectorOpened: false,
      donateDialogOpened: false
    };
  }

  changeBkgSelectorState(state) {
    this.setState({
      bkgSelectorOpened: state,
    });
  }

  changeDonateDialogState(state) {
    this.setState({
      donateDialogOpened: state,
    });
  }

  render() {

    const {app, user} = this.props;

    const content = {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 'auto',
      backgroundColor: 'rgba(0,0,0,.4)'
    }

    const greeting = {
      color: 'white',
      height: 330,
      paddingTop: 50,
      textAlign: 'center'
    };

    const subtitle = {
      fontSize: '3em',
      fontWeight: 'bold',
    };

    const actioBtnContainer = {
      position: 'absolute',
      bottom: 10,
      right: 10,
      display: 'flex',
      flexDirection: 'column',
    }

    return (
      <div>
        <UserBackgroundImage user={user} />
        <div style={content}>
          <div style={greeting}>
            <UserDisplay user={user} />
            <h1 style={subtitle}>Surf the web, save the world.</h1>
          </div>
        </div>
        <VcUser user={user} />
        <div style={actioBtnContainer}>
          <RaisedButton 
            onClick={this.changeBkgSelectorState.bind(this, true)}
            label={"CHANGE BACKGROUND"} 
            primary={true}
            icon={
              <FontIcon 
                className="fa fa-picture-o" />
            }/>

          <br/>
          
          <RaisedButton 
            onClick={this.changeDonateDialogState.bind(this, true)}
            label={"DONATE"} 
            secondary={true}
            icon={
              <FontIcon 
                className="fa fa-heart"/>
            }/>
        </div>

        <Dialog
          title="Select a background image"
          open={this.state.bkgSelectorOpened}
          autoScrollBodyContent={true}
          onRequestClose={this.changeBkgSelectorState.bind(this, false)}>
            <BackgroundImagePickerContainer 
              app={app} 
              user={user}
              onImageSelected={this.changeBkgSelectorState.bind(this, false)}/>
        </Dialog>
        <Dialog
          title="Donate"
          open={this.state.donateDialogOpened}
          autoScrollBodyContent={true}
          onRequestClose={this.changeDonateDialogState.bind(this, false)}>
            <DonateVcContainer 
              app={app} 
              user={user}/>
        </Dialog>
      </div>
    );
  }
}

Dashboard.propTypes = {
  user: React.PropTypes.object.isRequired,
  app: React.PropTypes.object.isRequired
};

export default Dashboard;
