import React from 'react';
import { Tab } from 'semantic-ui-react';
import AboutTab from './AboutTab';
import PhotosTab from './PhotosTab';
import EventsTab from './EventsTab';

export default function ProfileContent({profile, isCurrentUser}) {
    const panes = [
        {menuItem: 'About', render: () => <AboutTab profile={profile} isCurrentUser={isCurrentUser} />},
        {menuItem: 'Photos', render: () => <PhotosTab profile={profile} isCurrentUser={isCurrentUser} />},
        {menuItem: 'Events', render: () => <EventsTab profile={profile} />},
        {menuItem: 'Followers', render: () => <Tab.Pane>Followers</Tab.Pane>},
        {menuItem: 'Following', render: () => <Tab.Pane>Following</Tab.Pane>},
    ]

    return (
        <Tab 
            menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
        />
    )
}