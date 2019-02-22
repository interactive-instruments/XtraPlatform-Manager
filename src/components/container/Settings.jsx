
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { connectRequest, mutateAsync, requestAsync } from 'redux-query';
import { push } from 'redux-little-router'

import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import Paragraph from 'grommet/components/Paragraph';
import Alert from 'grommet/components/icons/base/Alert';
import Article from 'grommet/components/Article';

import SettingsApi from '../../apis/SettingsApi'
import SettingShow from '../container/SettingShow';

import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';
import Notification from 'grommet/components/Notification';




@connect(
    (state, props) => {
        return {
            settingIds: state.entities.settingIds,
            setting: state.entities.setting
        }
    },
    (dispatch) => {
        return {
            showSettings: () => {
                dispatch(push(`/settings`))
            },
            updateSetting: (id, setting) => {
                dispatch(mutateAsync(SettingsApi.updateSettingQuery(id, setting)))
                    .then((result) => {
                        if (result.status === 200) {
                            dispatch(requestAsync(SettingsApi.getSettingQuery(id)));
                        } else {
                            console.log('ERR', result)
                            const error = result.body && result.body.error || {}


                        }

                    })
            }
        }
    }
)

@connectRequest(
    (props) => {
        if (!props.settingIds || !props.settingIds.categories) {
            return SettingsApi.getSettingsQuery()
        }
        return props.settingIds.categories.map(id => SettingsApi.getSettingQuery(id))
    })


export default class Settings extends Component {


    render() {

        const { settingIds, updateSetting, setting } = this.props;

        var settingsArray = [];
        if (settingIds && setting) {
            for (var i = 0; i < Object.keys(settingIds.___metadata___).length; i++) {
                settingsArray.push(
                    <AccordionPanel key={i} heading={Object.values(settingIds.___metadata___)[i].label}>
                        <SettingShow settingId={settingIds.categories[i]} setting={setting[settingIds.categories[i]]} updateSetting={updateSetting} />
                    </AccordionPanel>)
            }
        }
        return (
            <Section pad={{ vertical: 'medium' }} full="horizontal">
                <Notification status="warning" message="Changes will not be applied until the server is restarted" pad={{ vertical: 'medium', horizontal: "medium" }} />

                <Accordion animate={true} openMulti={true} >
                    {settingsArray}
                </Accordion>
            </Section>
        );
    }

}
