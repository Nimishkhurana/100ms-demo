import firebase, { firestore } from './firebase';

const roomsCollection = firestore.collection('rooms');
class PeerState {
  constructor(peerInfo) {
    if (!peerInfo.mid) throw new Error('stream mid is needed'); // Figure out a way to handle this error if it occurs

    this.mid = peerInfo.mid;
    this.uid = peerInfo.uid;
    this.rid = peerInfo.rid;

    console.log('State created', this.mid);
  }

  update(peerInfo) {
    console.log('SAVE:', peerInfo, this.mid);
    return roomsCollection.doc(this.rid).set(
      {
        peers: {
          [this.uid]: {
            streams: {
              [this.mid]: peerInfo,
            },
          },
        },
      },
      { merge: true }
    );
  }

  delete() {
    console.log('DELETE', this.mid, this.uid, this.rid);
    return roomsCollection.doc(this.rid).set(
      {
        peers: {
          [this.uid]: {
            streams: {
              [this.mid]: firebase.firestore.FieldValue.delete(),
            },
          },
        },
      },
      { merge: true }
    );
  }
}

const listenToRoomState = (rid, cb, errorCb) => {
  roomsCollection.doc(rid).onSnapshot(doc => {
    cb(doc.data());
  }, errorCb);
};

export default PeerState;
export { listenToRoomState };
