import React from 'react';
import { Grid, Header, Tab, Card } from 'semantic-ui-react';
import ProfileCard from './ProfileCard';
import { useDispatch, useSelector } from 'react-redux';
import useFirestoreCollection from '../../../app/hooks/useFirestoreCollection';
import {
  getFollowersCollection,
  getFollowingCollection,
} from '../../../app/firestore/firestoreService';
import { listenToFollowers, listenToFollowings } from '../profileActions';

export default function FollowingTab({ profile, activeTab }) {
  const dispatch = useDispatch();
  const { followings, followers } = useSelector((state) => state.profile);

  useFirestoreCollection({
    query:
      activeTab === 3
        ? () => getFollowersCollection(profile.id)
        : () => getFollowingCollection(profile.id),
    data: (data) =>
      activeTab === 3
        ? dispatch(listenToFollowers(data))
        : dispatch(listenToFollowings(data)),
    deps: [activeTab, dispatch],
  });

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='user' content={activeTab === 3 ? 'Followers' : 'Following'} />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {activeTab === 3 && followers.map(profile => (
              <ProfileCard profile={profile} key={profile.id} />
            ))}
            {activeTab === 4 && followings.map(profile => (
              <ProfileCard profile={profile} key={profile.id} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}
