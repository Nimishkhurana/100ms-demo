import { firestore } from "./firebase"
const roomsCollection = firestore.collection("rooms")

export { roomsCollection }
