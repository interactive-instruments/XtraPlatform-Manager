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
import PropTypes from 'prop-types';
import ui from 'redux-ui';
import EditTiles from '../presentational/EditTiles'


@ui({
    state: {
        extensions:(props) => typeof props.service.extensions === "undefined" ? null : props.service.extensions,
        tiles:(props) => typeof props.service.extensions.tilesExtension ==="undefined" ? null : props.service.extensions.tilesExtension,
        formats: () => [],
        formatJsonArray: (props) => typeof props.service.extensions.tilesExtension === "undefined" ? true : typeof props.service.extensions.tilesExtension.formats ==="undefined" ? true : 
        Object.entries(
            props.service.extensions.tilesExtension.formats).map(([key,value])=>{
                if(value.toString()==="application/json"){
                    return new Map ([[value, true]]);
                }
                else{
                    return new Map ([[value, false]])
                }
            } 
        ),
        formatJsonEnabled: () => null,
        formatMvtArray: (props) => typeof props.service.extensions.tilesExtension === "undefined" ? true : typeof props.service.extensions.tilesExtension.formats ==="undefined" ? true : 
        Object.entries(
            props.service.extensions.tilesExtension.formats).map(([key,value])=>{
                if(value.toString()==="application/vnd.mapbox-vector-tile"){
                    return new Map ([[value, true]])
                }
                else{
                    return new Map ([[value, false]])
                }
            }
        ),
        formatMvtEnabled:()=>null,

        maxZoomLevel:(props) => typeof props.service.extensions.tilesExtension === "undefined" ? 22 : typeof props.service.extensions.tilesExtension.zoomLevels === "undefined" ? 22 :
        props.service.extensions.tilesExtension.zoomLevels.default.max,
        minZoomLevel:(props) => typeof props.service.extensions.tilesExtension === "undefined" ? 0 : typeof props.service.extensions.tilesExtension.zoomLevels === "undefined" ? 0 :
         props.service.extensions.tilesExtension.zoomLevels.default.min,
        maxSeeding:(props) => typeof props.service.extensions.tilesExtension === "undefined" ? "" :  typeof props.service.extensions.tilesExtension.seeding === "undefined" ? "" : 
        props.service.extensions.tilesExtension.seeding.default.max,
        minSeeding:(props) => typeof props.service.extensions.tilesExtension === "undefined" ? "" :  typeof props.service.extensions.tilesExtension.seeding === "undefined" ? "" :
        props.service.extensions.tilesExtension.seeding.default.min
    }
})





export default class ServiceEditTiles extends Component {
    render(){
        const {service, ui, updateUI} = this.props;

        return(
            service
            &&
            <EditTiles onChange={this.props.onChange} ui={ui} updateUI={updateUI} tilesEnabled={typeof this.props.service.extensions.tilesExtension === "undefined"  ? false : this.props.service.extensions.tilesExtension.enabled}/>
        );
    }
    





}

ServiceEditTiles.propTypes = {
    onChange: PropTypes.func.isRequired
};

ServiceEditTiles.defaultProps = {
};