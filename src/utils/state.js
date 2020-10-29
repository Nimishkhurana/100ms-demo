class State {
  constructor(peerInfo) {
    this.mid = peerInfo.mid
    this.uid = peerInfo.uid
    this.rid = peerInfo.rid
    console.log(this.mid)
  }

  update(peerInfo) {
    console.log("SAVE:", peerInfo, this.mid)
  }

  delete() {
    console.log("DELETE", this.mid, this.uid, this.rid)
  }
}

export default State
