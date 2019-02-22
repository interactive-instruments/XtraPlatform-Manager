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
import ServiceApi from '../../apis/ServiceApi'

import Split from 'grommet/components/Split';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Notification from 'grommet/components/Notification';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import LinkPreviousIcon from 'grommet/components/icons/base/LinkPrevious';
import MoreIcon from 'grommet/components/icons/base/More';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';

import ServiceActions from '../presentational/ServiceActions';
import ServiceEditGeneral from '../presentational/ServiceEditGeneral';
import ServiceEditTiles from '../presentational/ServiceEditTiles'
import ServiceEditStyles from '../presentational/ServiceEditStyles'
import Anchor from '../common/AnchorLittleRouter';

import { push } from 'redux-little-router'
import { actions, getSelectedService, getService, getFeatureTypes } from '../../reducers/service'



@connectRequest(
    (props) => ServiceApi.getServiceConfigQuery(props.urlParams.id)
)


@connect(
    (state, props) => {
        return {
            service: state.entities.serviceConfigs ? {
                ...state.entities.services[props.urlParams.id],
                ...state.entities.serviceConfigs[props.urlParams.id]
            } : null
        }
    },
    (dispatch) => {
        return {
            ...bindActionCreators(actions, dispatch),
            dispatch,
            updateService: (service) => {
                // TODO: return updated service on POST request
                dispatch(mutateAsync(ServiceApi.updateServiceQuery(service)))
                    .then((result) => {
                        if (result.status === 200) {
                            dispatch(requestAsync(ServiceApi.getServiceQuery(service.id)));
                            dispatch(requestAsync(ServiceApi.getServiceConfigQuery(service.id)));
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

export default class ServiceShow extends Component {

    constructor(props) {
        super(props);

        //this._onResponsive = this._onResponsive.bind(this);
        this._onToggleSidebar = this._onToggleSidebar.bind(this);

        this.state = {
            layerName: undefined,
            showSidebarWhenSingle: false
        };
    }

    // TODO: use some kind of declarative wrapper like refetch
    /*componentDidMount() {
        const {selectService, params} = this.props;

        selectService(params.id);
    }

    componentWillReceiveProps(nextProps) {
        const {selectService} = this.props;
        const {params, selectedService} = nextProps;

        if (params && selectedService !== params.id)
            selectService(params.id);
    }*/

    _onToggleSidebar() {
        this.setState({
            showSidebarWhenSingle: !this.state.showSidebarWhenSingle
        });
    }

    _onChange = (change) => {
        const { service, updateService } = this.props;

        updateService({
            ...change,
            id: service.id
        });
    }

    // TODO: use some kind of declarative wrapper like refetch
    render() {
        const { service, children, updateService, deleteService } = this.props;
        console.log('loading service ', service ? service.id : 'none');

        let sidebar;
        let sidebarControl;
        let onSidebarClose;
        if ('single' === this.props.responsive) {
            sidebarControl = (
                <Button icon={<MoreIcon />} onClick={this._onToggleSidebar} />
            );
            onSidebarClose = this._onToggleSidebar;
        }
        sidebar = (
            <ServiceActions service={service}
                onClose={onSidebarClose}
                updateService={updateService}
                removeService={deleteService} />
        );

        const stylesEnabled = service && service.capabilities && service.capabilities.find(ext => ext.extensionType === 'STYLES').enabled;
        const tilesEnabled = service && service.capabilities && service.capabilities.find(ext => ext.extensionType === 'TILES').enabled;

        return (
            service ? <Split flex="left"
                separator={true}
                priority={this.state.showSidebarWhenSingle ? 'right' : 'left'}
                onResponsive={this._onResponsive}>
                <div>
                    <Header pad={{ horizontal: "small", between: 'small', vertical: "medium" }}
                        justify="start"
                        size="large"
                        colorIndex="light-2">
                        <Anchor icon={<LinkPreviousIcon />} path="/services" a11yTitle="Return" />
                        <Heading tag="h1"
                            margin="none"
                            strong={true}
                            truncate={true}>
                            {service.label}
                        </Heading>
                        {sidebarControl}
                    </Header>
                    <Article pad="none" align="start" primary={true}>
                        <Section full="horizontal" pad="none">
                            <Notification pad="medium" status={service.status === 'STARTED' ? 'ok' : 'critical'} message={service.status === 'STARTED' ? 'Online' : 'Offline'} />
                        </Section>
                        <Section pad={{ vertical: 'medium' }} full="horizontal">
                            <Accordion animate={true} openMulti={true} active={0}>
                                <AccordionPanel heading="General">
                                    <ServiceEditGeneral service={service} onChange={this._onChange} />
                                </AccordionPanel>
                                {
                                    stylesEnabled ?
                                        <AccordionPanel heading="Styles">
                                            <ServiceEditStyles styles={service.capabilities.find(ext => ext.extensionType === 'STYLES')} otherCapabilities={service.capabilities.filter(ext => ext.extensionType !== 'STYLES')} onChange={this._onChange} />
                                        </AccordionPanel>
                                        : <span />
                                }
                                {
                                    tilesEnabled ?
                                        <AccordionPanel heading="Vector Tiles">
                                            <ServiceEditTiles tiles={service.capabilities.find(ext => ext.extensionType === 'TILES')} otherCapabilities={service.capabilities.filter(ext => ext.extensionType !== 'TILES')} onChange={this._onChange} />
                                        </AccordionPanel>
                                        : <span />
                                }
                                {children}
                            </Accordion >
                        </Section>
                    </Article>
                </div>
                {sidebar}
            </Split>
                : null
        );
    }
}
