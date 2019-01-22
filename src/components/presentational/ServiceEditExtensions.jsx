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
import ui from 'redux-ui';


import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';

import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';



@ui({
    state: {
        service: (props)=> props.service,
        extensions: (props) => typeof    props.service.extensions === "undefined" ? null : props.service.extensions
    }
})

export default class ServiceEditExtensions extends Component {

    _save = () => {
        const {ui, onChange} = this.props;

        onChange({extensions: ui.extensions});
    }
    
   

    render() {
        const {service, ui, updateUI} = this.props;
        if(ui.extensions){
            var numberOfExtensions=Object.keys(ui.extensions).length
            var displayExtensionsEnabled=[];
            console.log(ui.extensions)
            if(numberOfExtensions!== 0){
                displayExtensionsEnabled.push(
                    <Box pad={ {vertical:'small',horizontal:'none'} }>
                        <Heading tag="h3">
                            Extensions
                        </Heading>
                    </Box>
        
                )
            }
            console.log(ui.extensions)        
            for(var i=0; i < numberOfExtensions; i++){
                var extensionType = Object.values(ui.extensions)[i].extensionType
                var extensionName = Object.keys(ui.extensions)[i]
                console.log(extensionName)

                createCheckbox(this._save,displayExtensionsEnabled,extensionName)

            }
        }
        
        function createCheckbox(save,displayExtensionsEnabled,extensionName){
        
            return displayExtensionsEnabled.push(
                <CheckboxUi name={"enabled"}
                            label={extensionType}
                            checked={ui.extensions[extensionName].enabled}
                            onChange={(field, value) =>  updateUI("extensions", 
                                {...ui.extensions, 
                                    [extensionName]: {
                                        ...ui.extensions[extensionName], 
                                        [field]:value
                                    }
                                }
                            )} 
                            //(field, value) =>  updateUI('setting', {...ui.setting, [field]: value})
                            onDebounce={ save }/>  
            )
        
        
            
        }

        return (
            
            service && 

                <Box pad={ {horizontal:'medium', vertical:'none'} }>
                    {displayExtensionsEnabled}
                </Box>

              
  
        );
    }
}

