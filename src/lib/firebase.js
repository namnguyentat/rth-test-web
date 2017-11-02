// @flow

import * as Firebase from 'firebase'
import uuid from 'uuid'
import Config from 'config'

const app = {
  apiKey: Config.firebase.apiKey,
  authDomain: Config.firebase.authDomain,
  databaseURL: Config.firebase.databaseURL,
  storageBucket: Config.firebase.storageBucket,
  messagingSenderId: Config.firebase.messagingSenderId
}
Firebase.initializeApp(app)

const storageRef = {
  avatars: Firebase.storage().ref('avatars'),
  photos: Firebase.storage().ref('photos')
}

export const upload = (
  file: Object,
  uploadSuccessCB: Function,
  uploadFailureCB: Function,
  ref?: string
) => {
  const storage = storageRef[ref || 'avatars']

  if (!storage) {
    return
  }

  const fileType = file.type.split('/')[1]
  var fileRef = storage.child(`${uuid()}.${fileType}`)
  fileRef.put(file).then(function(snapshot) {
    if (snapshot.state === 'success') {
      uploadSuccessCB(snapshot.downloadURL)
    } else {
      uploadFailureCB(snapshot)
    }
  })
}

export const editorUploadPhotoCallback = (file: Object) => {
  const fileType = file.type.split('/')[1]
  var fileRef = storageRef['photos'].child(`${uuid()}.${fileType}`)
  return fileRef.put(file).then(snapshot => {
    return new Promise((resolve, reject) => {
      resolve({ data: { link: snapshot.downloadURL } })
    })
  })
}
