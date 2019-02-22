import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ui from 'redux-ui';

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
import { validateFormats, validateZoomLevel, validateSeeding } from 'xtraplatform-manager/src/util/tiles-validator';


@ui({
    state: {
        formats: [],
        formatJsonArray: (props) => !props.tiles || !props.tiles.formats ? true :
            Object.entries(
                props.tiles.formats).map(([key, value]) => {
                    if (value.toString() === "application/json") {
                        return new Map([[value, true]]);
                    }
                    else {
                        return new Map([[value, false]])
                    }
                }
                ),
        formatJsonEnabled: null,
        formatMvtArray: (props) => !props.tiles || !props.tiles.formats ? true :
            Object.entries(
                props.tiles.formats).map(([key, value]) => {
                    if (value.toString() === "application/vnd.mapbox-vector-tile") {
                        return new Map([[value, true]])
                    }
                    else {
                        return new Map([[value, false]])
                    }
                }
                ),
        formatMvtEnabled: null,

        minZoomLevel: (props) => !props.tiles || !props.tiles.zoomLevels ? 0 : props.tiles.zoomLevels.default.min,
        maxZoomLevel: (props) => !props.tiles || !props.tiles.zoomLevels ? 22 : props.tiles.zoomLevels.default.max,
        minSeeding: (props) => !props.tiles || !props.tiles.seeding ? "" : props.tiles.seeding.default.min,
        maxSeeding: (props) => !props.tiles || !props.tiles.seeding ? "" : props.tiles.seeding.default.max,
    }
})

@uiValidator({
    formats: validateFormats(),
    maxZoomLevel: validateZoomLevel(true),
    minZoomLevel: validateZoomLevel(false),
    maxSeeding: validateSeeding(true),
    minSeeding: validateSeeding(false)
}, true)

export default class ServiceEditTiles extends Component {


    _save = () => {
        const { otherCapabilities, ui, validator, onChange } = this.props;

        if (validator.valid) {
            onChange({
                capabilities: otherCapabilities
                    .concat({
                        extensionType: "TILES",
                        enabled: true,
                        formats: ui.formats,
                        zoomLevels: {
                            default: {
                                max: ui.maxZoomLevel,
                                min: ui.minZoomLevel
                            }
                        },
                        seeding: {
                            default: {
                                max: ui.maxSeeding,
                                min: ui.minSeeding
                            }
                        }
                    })
                    .sort((a, b) => a.extensionType < b.extensionType ? -1 : a.extensionType === b.extensionType ? 0 : 1)
            });
        }
    }

    render() {
        const { ui, updateUI, validator } = this.props;


        return (
            <Section pad={{ vertical: 'medium' }} full="horizontal">
                <Form compact={false} pad={{ horizontal: 'medium', vertical: 'small' }}>

                    <Box pad={{ vertical: 'medium' }}>
                        <Heading tag="h4">
                            Formats
                             </Heading>
                    </Box>

                    <FormFields>
                        <fieldset>
                            <FormField >
                                <CheckboxUi name='formatJsonEnabled'
                                    label="application/json"
                                    checked={ui.formatJsonEnabled}
                                    onChange={updateUI}
                                    onDebounce={this._save}
                                    disabled={!ui.formatMvtEnabled}
                                    toggle={false}
                                    reverse={false} />
                                <CheckboxUi name='formatMvtEnabled'
                                    label="application/vnd.mapbox-vector-tile"
                                    checked={ui.formatMvtEnabled}
                                    onChange={updateUI}
                                    onDebounce={this._save}
                                    disabled={!ui.formatJsonEnabled}
                                    toggle={false}
                                    reverse={false} />
                            </FormField>
                        </fieldset>
                    </FormFields>

                    <Box pad={{ horizontal: 'none', vertical: 'medium' }}>
                        <Heading tag="h4">
                            Zoom Level
                                 </Heading>
                    </Box>

                    <FormField label="min zoom level" error={validator.messages.minZoomLevel}>
                        <TextInputUi name="minZoomLevel"
                            value={ui.minZoomLevel}
                            placeHolder="value between 0 and 22"
                            onChange={updateUI}
                            onDebounce={this._save}
                        />
                    </FormField>
                    <FormField label="max zoom level" error={validator.messages.maxZoomLevel} >
                        <TextInputUi name="maxZoomLevel"
                            value={ui.maxZoomLevel}
                            placeHolder="value between 0 and 22"
                            onChange={updateUI}
                            onDebounce={this._save}
                        />
                    </FormField>

                    <Box pad={{ horizontal: 'none', vertical: 'medium' }}>
                        <Heading tag="h4">
                            Seeding
                                 </Heading>
                    </Box>
                    <FormField label="begin seeding" error={validator.messages.minSeeding}>
                        <TextInputUi name="minSeeding"
                            value={ui.minSeeding}
                            placeHolder="value between zoom Level range"
                            onChange={updateUI}
                            onDebounce={this._save}
                        />
                    </FormField>
                    <FormField label="end seeding" error={validator.messages.maxSeeding}>
                        <TextInputUi name="maxSeeding"
                            value={ui.maxSeeding}
                            placeHolder="value between zoom Level range"
                            onChange={updateUI}
                            onDebounce={this._save}
                        />
                    </FormField>

                </Form>
            </Section>
        );
    }
}

ServiceEditTiles.propTypes = {
    onChange: PropTypes.func.isRequired
};

ServiceEditTiles.defaultProps = {
};
