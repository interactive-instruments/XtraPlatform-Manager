/*
 * Copyright 2017 European Union
 * Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 * https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 * This work was supported by the EU Interoperability Solutions for
 * European Public Administrations Programme (https://ec.europa.eu/isa2)
 * through the ELISE action (European Location Interoperability Solutions 
 * for e-Government).
 */

import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest, mutateAsync, requestAsync } from 'redux-query';
import { Animate } from "react-show";
import ServiceApi from '../../apis/ServiceApi'

import { Box, Button, Heading, Tabs, Tab } from 'grommet'
import { LinkPrevious as LinkPreviousIcon, More as MoreIcon, Globe } from 'grommet-icons'

import ServiceActions from '../presentational/ServiceActions';
import ServiceEditGeneral from '../presentational/ServiceEditGeneral';
import ServiceTask from '../presentational/ServiceTask'
import Anchor from '../common/AnchorLittleRouter';
import Header from '../common/Header';
import Notification from '../common/Notification';
import StatusIcon from '../common/StatusIcon';

import { push } from 'redux-little-router'
import { actions, getToken, getSelectedService, getService, getFeatureTypes } from '../../reducers/service'
import NotificationWithCollapsibleDetails from '../common/NotificationWithCollapsibleDetails';



@connectRequest(
    (props) => ServiceApi.getServiceConfigQuery(props.urlParams.id, true)
)


@connect(
    (state, props) => {
        return {
            service: state.entities.serviceConfigs ? {
                ...state.entities.services[props.urlParams.id],
                ...state.entities.serviceConfigs[props.urlParams.id]
            } : null,
            token: getToken(state),
        }
    },
    (dispatch) => {
        return {
            ...bindActionCreators(actions, dispatch),
            dispatch,
            updateService: (serviceId, update) => {
                // TODO: return updated service on POST request
                dispatch(mutateAsync(ServiceApi.updateServiceQuery(serviceId, update)))
                    .then((result) => {
                        if (result.status === 200) {
                            //dispatch(requestAsync(ServiceApi.getServiceQuery(service.id, true)));
                            //dispatch(requestAsync(ServiceApi.getServiceConfigQuery(service.id, true)));
                        } else {
                            console.log('ERR', result)
                            const error = result.body && result.body.error || {}

                            // TODO: rollback ui

                            /*dispatch(actions.addFailed({
                                ...service,
                                ...error,
                                text: 'Failed to add service with id ' + service.id,
                                status: 'critical'
                            }))*/
                        }
                    })

                //dispatch(push('/services'))
            },
            deleteService: (service) => {
                dispatch(mutateAsync(ServiceApi.deleteServiceQuery(service)))
                    .then((result) => {
                        if (result.status === 200) {
                            dispatch(requestAsync(ServiceApi.getServicesQuery()));
                        } else {
                            console.log('ERR', result)
                            const error = result.body && result.body.error || {}
                        }
                    })

                dispatch(push('/services'))
            }
        }
    }
)

export default class Service extends Component {

    constructor(props) {
        super(props);

        //this._onResponsive = this._onResponsive.bind(this);
        this._onToggleSidebar = this._onToggleSidebar.bind(this);

        this.state = {
            layerName: undefined,
            showSidebarWhenSingle: false
        };
    }

    _onToggleSidebar() {
        this.setState({
            showSidebarWhenSingle: !this.state.showSidebarWhenSingle
        });
    }

    _onChange = (change) => {
        const { service, updateService } = this.props;

        updateService(service.id, change);
    }

    _onTabSelect = (label) => {
        const { service, dispatch } = this.props;
        dispatch(push(
            {
                pathname: '/services/' + service.id,
                query: {
                    tab: label
                }
            }))
    }

    render() {
        const { service, children, updateService, deleteService, getTypedComponent, getExtendableComponents, urlQuery, token, reloadPending, queryPending } = this.props;
        console.log('loading service ', service ? service.id : 'none');

        const editTabs = getExtendableComponents('ServiceEdit');
        const selectedTab = urlQuery && urlQuery.tab && Math.max(Object.keys(editTabs).findIndex(label => label === urlQuery.tab), 0);

        let onSidebarClose;
        if ('single' === this.props.responsive) {
            sidebarControl = (
                <Button icon={<MoreIcon />} onClick={this._onToggleSidebar} />
            );
            onSidebarClose = this._onToggleSidebar;
        }

        const isOnline = service && 'STARTED' === service.status;

        const ViewActions = getTypedComponent('ServiceActionsView', 'default');

        //TODO: featureProvider is not known here, create generic error interface in service
        let mappingError;
        const mappingStatus = service && service.featureProvider && service.featureProvider.mappingStatus;
        if (mappingStatus && mappingStatus.enabled && !mappingStatus.supported && mappingStatus.errorMessage) {
            mappingError = <Box pad="small" flex={false}>
                <NotificationWithCollapsibleDetails
                    size="medium"
                    pad="medium"
                    margin={{ bottom: 'small' }}
                    status="critical"
                    message={mappingStatus.errorMessage}
                    details={mappingStatus.errorMessageDetails} />
            </Box>
        }


        return (
            service ? /*<Animate
                show={true} // Toggle true or false to show or hide the content!
                transitionOnMount={true}
                easing={Animate.easings.easeInCubic}
                duration={500}
                style={{
                    width: "auto",
                    height: "100%"
                }}
                enter={{
                    width: "auto"
                }}
                start={{
                    width: 0 // The starting style for the component.
                    // If the 'leave' prop isn't defined, 'start' is reused!
                }}
            >*/
                <Box fill={true}>
                    <Header pad={{ horizontal: "small", between: 'small' }}
                        border={{ side: 'bottom', size: 'small', color: 'light-4' }}
                        justify="between"
                        size="large">
                        <Box direction='row' gap='small' align='center'>
                            {/*<StatusIcon value={isOnline ? 'ok' : 'critical'} />*/}
                            {/*<Anchor icon={<LinkPreviousIcon />} path="/services" a11yTitle="Return" />*/}
                            <Globe />
                            <Heading level="3"
                                margin="none"
                                strong={true}
                                truncate={true}>
                                {service.id} - {service.label}
                            </Heading>
                        </Box>
                        {service.hasBackgroundTask && <ServiceTask progress={service.progress} message={service.message} />}
                        <ServiceActions
                            id={service.id}
                            status={service.status}
                            shouldStart={service.shouldStart}
                            secured={service.secured}
                            token={token}
                            onClose={onSidebarClose}
                            updateService={this._onChange}
                            removeService={deleteService}
                            ViewActions={ViewActions} />
                    </Header>
                    <Tabs justify='start' margin={{ top: 'small' }} activeIndex={selectedTab} onActive={index => this._onTabSelect(Object.keys(editTabs)[index])}>
                        {editTabs &&
                            Object.keys(editTabs).map(tab => {
                                const Edit = editTabs[tab];
                                return <Tab title={tab} key={tab} >
                                    <Box fill={true} overflow={{ vertical: 'auto' }}>
                                        {mappingError}
                                        <Edit {...service} key={service.id} token={token} onChange={this._onChange} />
                                    </Box>
                                </Tab>
                            })
                        }
                    </Tabs>
                    {/*<Box as="article" basis="auto" pad="none" align="start" primary={true}>
                            <Box as="section" fill="horizontal" pad="none">
                                <Notification pad="medium" status={service.status === 'STARTED' ? 'ok' : 'critical'} message={service.status === 'STARTED' ? 'Online' : 'Offline'} />
                            </Box>
                            <ServiceEditGeneral service={service} onChange={this._onChange} />
                            {children}
            </Box>*/}
                </Box>
                /*</Animate>*/
                : null
        );
    }
}

