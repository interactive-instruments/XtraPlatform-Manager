
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { connectRequest, mutateAsync, requestAsync } from 'redux-query';
import { push } from 'redux-little-router'

import { Box, Heading, Paragraph, Accordion, AccordionPanel } from 'grommet';
import { Alert } from 'grommet-icons';

import SettingsApi from '../../apis/SettingsApi'
import SettingShow from '../container/SettingShow';
import { withAppConfig } from '../../app-context'

@withAppConfig()

@connect(
    (state, props) => {
        return {
            settingIds: state.entities.settingIds,
            setting: state.entities.setting
        }
    },
    (dispatch, props) => {
        return {
            showSettings: () => {
                dispatch(push(`/settings`))
            },
            updateSetting: (id, setting) => {
                dispatch(mutateAsync(SettingsApi.updateSettingQuery(id, setting, { secured: props.appConfig.secured })))
                    .then((result) => {
                        if (result.status === 200) {
                            dispatch(requestAsync(SettingsApi.getSettingQuery(id, { secured: props.appConfig.secured })));
                        } else {
                            if (process.env.NODE_ENV !== 'production') {
                                console.log('ERR', result)
                                const error = result.body && result.body.error || {}
                            }
                        }

                    })
            }
        }
    }
)

@connectRequest(
    (props) => {
        if (!props.settingIds || !props.settingIds.categories) {
            return SettingsApi.getSettingsQuery({ forceReload: true, secured: props.appConfig.secured })
        }
        return props.settingIds.categories.map(id => SettingsApi.getSettingQuery(id, { secured: props.appConfig.secured }))
    })


export default class Settings extends Component {


    render() {

        const { settingIds, updateSetting, setting } = this.props;

        var settingsArray = [];
        if (settingIds && setting) {
            for (var i = 0; i < Object.keys(settingIds.___metadata___).length; i++) {
                var s = setting[settingIds.categories[i]];
                if (s && settingIds.categories[i] === 'webserver')
                    settingsArray.push(
                        <AccordionPanel key={i} label={Object.values(settingIds.___metadata___)[i].label}>
                            <SettingShow settingId={settingIds.categories[i]} setting={setting[settingIds.categories[i]]} updateSetting={updateSetting} />
                        </AccordionPanel>)
            }
        }
        return (
            <Box as='section' pad={{ vertical: 'medium' }} full="horizontal">
                <Box pad={{ vertical: 'medium', horizontal: "medium" }}>
                    <Heading tag="h2">
                        Attention
                                    </Heading>

                    <Paragraph size="large"/*style={{color:"#EB6060"}}*/>
                        <Alert />
                        &nbsp;
                         Changes to the settings will not be applied until the server is restarted
                                    </Paragraph>
                </Box>

                <Accordion animate={true} multiple={true} >
                    {settingsArray}
                </Accordion>
            </Box>
        );
    }

}
