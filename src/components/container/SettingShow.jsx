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

import React, { Component, PropTypes } from 'react';
import ui from 'redux-ui';


import Section from 'grommet/components/Section';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';


import SelectUi from 'xtraplatform-manager/src/components/common/SelectUi';
import uiValidator from 'xtraplatform-manager/src/components/common/ui-validator';
import TextInputUi from 'xtraplatform-manager/src/components/common/TextInputUi';
import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';




const validate = () => (value,ui) => {
    var errors={};
    if(value && ui.settingMetadata){
        for(var k=0; k< Object.keys(ui.settingMetadata).length;k++){
            if(ui.settingMetadata[Object.keys(ui.settingMetadata)[k]].uitype==="URL"){
                var urlToCheck = ui.setting[ui.settingMetadata[Object.keys(ui.settingMetadata)[k]].name];
                if(urlToCheck!== ""){
                var pattern = new RegExp('^(https?:\\/\\/)?'+ 
                '((([a-z{}\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ 
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+{}]*)*'+
                '(\\?[;&a-z\\d%_.~+=-]*)?'+
                '(\\#[-a-z\\d_]*)?$','i'); 
                if(!pattern.test(urlToCheck)){
                    var name=Object.values(ui.settingMetadata)[k].name
                    var obj={};
                    obj[name]="invalid URL"
                    errors[name]=obj                         
            }}
                
           }   
        }
        if(Object.keys(errors).length !== 0 && errors.constructor === Object){
            return errors;
        }
    }
}

@ui({
    state: {
        setting: (props) => {
            if(props.setting){
                const {___metadata___, ...rest} = props.setting; 
                return rest;
            }
        },
        settingMetadata: (props) => {
            if(props.setting){
                const {___metadata___, ...rest} = props.setting; 
                return ___metadata___;
            }
            
        }
    }
})

@uiValidator({
    setting: validate()
 }, true)

export default class SettingShow extends Component {
    _save = () => {
        
        const {ui, updateSetting, settingId,validator} = this.props;
        if (validator.valid){
            updateSetting(settingId, ui.setting)
        }
    }
    
    render() {
        const {ui,updateUI,setting,validator} = this.props;
        var displaySetting=[];
        
        if(setting && ui.setting){
        var metadata= setting.___metadata___;
            if (metadata){
                for (var i = 0; i < Object.keys(metadata).length; i++){

                    if(Object.values(metadata)[i].uitype === "CHECKBOX"){
                        var label=Object.values(metadata)[i].label;
                        var name=Object.values(metadata)[i].name;
                        displaySetting.push(
                            <FormField key={i}>
                                <CheckboxUi name={name}
                                            label={label}
                                            checked={ui.setting[name] === 'true' || ui.setting[name] === true}
                                            onChange={(field, value) =>  updateUI('setting', {...ui.setting, [field]: value})} 
                                            onDebounce={ this._save }/>  
                            </FormField>
                        )
                    }

                    else if(Object.values(metadata)[i].uitype === "SELECT"){
                        var label=Object.values(metadata)[i].label;
                        var name=Object.values(metadata)[i].name;
                        var allowedValues=Object.values(metadata)[i].allowedvalues;
                        var optionsArray= allowedValues.substring(1,allowedValues.length-1).split(", ") //TODO add Array support to select field
                        
                        var labelsArray=[];
                        var valuesArray=[];
                        for(var u = 0; u < optionsArray.length; u++){
                            valuesArray.push(optionsArray[u].split(" '")[0].substring(0,optionsArray[u].split(" '")[0].length-1));
                            labelsArray.push(optionsArray[u].split(" '")[1].substring(0,optionsArray[u].split(" '")[1].length-1));
                        }
                       
                        var  options=[];
                        for(var u = 0; u < valuesArray.length; u++){
                            var option={};
                            option.value=valuesArray[u];
                            option.label=labelsArray[u];
                            options.push(option);
                        }
                        
    
                        displaySetting.push(
                            <FormField key={i}>
                                <SelectUi name={ name}   
                                    placeHolder={name}
                                    options={options}
                                    value={ui.setting[name]}
                                    onChange={(field, value) =>  updateUI('setting', {...ui.setting, [field]: value})}
                                    onDebounce={ this._save }
                                />
                            </FormField>
                        )
                    }

                    else if(Object.values(metadata)[i].uitype === "URL"){
                        var name= Object.values(metadata)[i].name;
                        var label=Object.values(metadata)[i].label; 
                        var hidden=Object.values(metadata)[i].hidden; 
                        if(!hidden){
                            displaySetting.push(
                                <FormField key={i} label={label} error={ validator.messages.setting && validator.messages.setting[name] && validator.messages.setting[name][name] }>
                                    <TextInputUi name={name}
                                        value={ ui.setting[name]}
                                        onChange={(field, value) =>updateUI('setting', {...ui.setting, [field]: value})}
                                        onDebounce={this._save} 
                                    />
                                </FormField>
                            )
                        }
                    }

                    else {
                        var name= Object.values(metadata)[i].name;
                        var label=Object.values(metadata)[i].label; 
                        var hidden=Object.values(metadata)[i].hidden; 
                        if(!hidden){
                            displaySetting.push(
                                <FormField key={i} label={label}>
                                    <TextInputUi name={name}
                                        value={ ui.setting[name]}
                                        onChange={(field, value) =>updateUI('setting', {...ui.setting, [field]: value})}
                                        onDebounce={this._save} 
                                    />
                                </FormField>
                            )
                        }
                    }
                }
            }  
        }

        return (
            <Section pad={ { vertical: 'medium' } } full="horizontal">
                <Form compact={ false } pad={ { horizontal: 'medium', vertical: 'small' } }>
                    <FormFields>
                        <fieldset>
                            {displaySetting}
                        </fieldset>
                    </FormFields>       
                </Form> 
            </Section>      
        );
    }
}

