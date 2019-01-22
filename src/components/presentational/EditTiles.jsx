import React, { Component } from 'react';

import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';


import TextInputUi from 'xtraplatform-manager/src/components/common/TextInputUi';
import CheckboxUi from 'xtraplatform-manager/src/components/common/CheckboxUi';

import uiValidator, { forbiddenChars } from 'xtraplatform-manager/src/components/common/ui-validator';
const validateFormats = () => (value, ui) => {


 if(ui.formatJsonEnabled===null){
     Array.isArray(ui.formatJsonArray) ? 
         ui.formatJsonArray.forEach(function(entry){
             if(entry.get("application/json")!== undefined)
                 ui.formatJsonEnabled=entry.get("application/json")

         })
     :  ui.formatJsonEnabled = ui.formatJsonArray;
 }


 if(ui.formatMvtEnabled===null){
     Array.isArray(ui.formatMvtArray) ? 
         ui.formatMvtArray.forEach(function(entry){
             if(entry.get("application/vnd.mapbox-vector-tile")!== undefined)
                 ui.formatMvtEnabled=entry.get("application/vnd.mapbox-vector-tile")
         }) 
     :  ui.formatMvtEnabled = ui.formatMvtArray;
 }

 if(ui.formatJsonEnabled===true && ui.formatMvtEnabled===true){
     var formatsToAdd = ["application/json","application/vnd.mapbox-vector-tile"];
     ui.formats=ui.formats.concat(formatsToAdd);
 }
 if(ui.formatJsonEnabled===true && ui.formatMvtEnabled===false){
     var formatsToAdd = ["application/json"];
     ui.formats=ui.formats.concat(formatsToAdd);
 }

 if(ui.formatJsonEnabled===false && ui.formatMvtEnabled===true){
     var formatsToAdd = ["application/vnd.mapbox-vector-tile"];
     ui.formats=ui.formats.concat(formatsToAdd);
 }

 if(ui.formatJsonEnabled===false && ui.formatMvtEnabled===false){
     var formatsToAdd = [];
     ui.formats=ui.formats.concat(formatsToAdd);
 }
   
}

const validateZoomLevel = (isMax) => (value, ui) => {
 value=parseInt(value);
 if(value<0 || value>22)
     return "invalid for the Google Maps Tiling Scheme"
 if(isMax && value<ui.minZoomLevel)
     return "invalid, must be greater then the minimum zoom level"
 if(!isMax && value>ui.maxZoomLevel)
     return "invalid, must be smaller then the maximum zoom level" 
   
}

const validateSeeding = (isMax) => (value, ui) => {
 value=parseInt(value);
 if(isMax && value<ui.minSeeding)
     return "invalid, must be greater then the minimum seeding"
 if(!isMax && value>ui.maxSeeding)
     return "invalid, must be smaller then the maximum seeding" 
   
 if(isMax && value>ui.maxZoomLevel)
     return "invalid for the specified zoom levels"
 if(!isMax && value<ui.minZoomLevel )
     return "invalid for the specified zoom levels"

 
   
}
@uiValidator({
 formats:validateFormats(),
 maxZoomLevel: validateZoomLevel(true),
 minZoomLevel: validateZoomLevel(false),
 maxSeeding: validateSeeding(true),
 minSeeding: validateSeeding(false)
}, true)

export default class EditTiles extends Component {

 
 _save = () => {
     const {ui, validator, onChange} = this.props;
     console.log(ui.extension)
     if (validator.valid) {
         onChange({
             extensions:{
                 ...ui.extensions,
                 tilesExtension:{
                     extensionType:"TILES",
                     enabled: true,
                     formats: ui.formats, 
                     zoomLevels:{
                         default:{
                             max: ui.maxZoomLevel,
                             min: ui.minZoomLevel
                         }
                     },
                     seeding:{
                         default:{
                             max: ui.maxSeeding,
                             min: ui.minSeeding
                         }
                     }
                 }
             }

         });
     }
 }

 render() {
     const { ui, updateUI, validator,tilesEnabled} = this.props;


     return (tilesEnabled &&
         <Section pad={ { vertical: 'medium' } } full="horizontal">
             <Accordion animate={true} multiple={true}>
                 <AccordionPanel heading="Tiles">
                     <Form compact={ false } pad={ { horizontal: 'medium', vertical: 'small' } }>
                         
                         <Box pad={ {vertical:'medium'} }>
                             <Heading tag="h4">
                                 Formats
                             </Heading>
                         </Box>

                         <FormFields>
                             <fieldset>
                                 <FormField >
                                     <CheckboxUi name='formatJsonEnabled'
                                         label="application/json"
                                         checked={ ui.formatJsonEnabled } 
                                         onChange={updateUI}
                                         onDebounce={this._save}
                                         disabled={!ui.formatMvtEnabled} 
                                         toggle={ false }
                                         reverse={ false } />
                                     <CheckboxUi name='formatMvtEnabled'
                                         label="application/vnd.mapbox-vector-tile"
                                         checked={ ui.formatMvtEnabled } 
                                         onChange={updateUI}
                                         onDebounce={this._save}
                                         disabled={!ui.formatJsonEnabled}  
                                         toggle={ false }
                                         reverse={ false } />
                                 </FormField>                                    
                             </fieldset>
                         </FormFields>
                         
                             <Box pad={ {horizontal:'none', vertical:'medium'} }>
                                 <Heading tag="h4">
                                     Zoom Level
                                 </Heading>
                             </Box>
                            
                             <FormField label="min zoom level" error={ validator.messages.minZoomLevel }>
                                 <TextInputUi name="minZoomLevel"
                                     value={ ui.minZoomLevel }
                                     placeHolder="value between 0 and 22"
                                     onChange={ updateUI }
                                     onDebounce={ this._save }
                                    />
                             </FormField>
                             <FormField label="max zoom level"error={ validator.messages.maxZoomLevel } >
                                 <TextInputUi name="maxZoomLevel"
                                     value={ ui.maxZoomLevel }
                                     placeHolder="value between 0 and 22"
                                     onChange={ updateUI }
                                     onDebounce={ this._save }
                                    />
                             </FormField>
                     
                             <Box pad={ {horizontal:'none', vertical:'medium'} }>
                                 <Heading tag="h4">
                                     Seeding
                                 </Heading>
                             </Box>
                             <FormField label="begin seeding" error={ validator.messages.minSeeding }>
                                 <TextInputUi name="minSeeding"
                                     value={ ui.minSeeding }
                                     placeHolder="value between zoom Level range"
                                     onChange={ updateUI }
                                     onDebounce={ this._save }
                                     />
                             </FormField>
                             <FormField label="end seeding" error={ validator.messages.maxSeeding }>
                                 <TextInputUi name="maxSeeding"
                                     value={ ui.maxSeeding }
                                     placeHolder="value between zoom Level range"
                                     onChange={ updateUI }
                                     onDebounce={ this._save }
                                     />
                             </FormField>
                 
                     </Form>
                
                 </AccordionPanel>
                
                 </Accordion>
             
         </Section>
     );
 }
}