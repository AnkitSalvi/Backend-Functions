const db = require('./firebase-init.js')


getPath = (path, isDebug) => {
	if (isDebug) {
		let updatedPath = path

		if (path.charAt(0) === '/') {
			updatedPath = path.substring(1)
		}

		return "DEBUG/v1/" + updatedPath
	}

	return path
}


exports.firestoreDocument = (path, isDebug) => {
	return db.doc(getPath(path, isDebug))
}



exports.firebaseDocumentFromRef = (path, isDebug) => {
	return db.doc(getPath(path, isDebug))
}

exports.firestoreCollection = (path, isDebug) => {
	return db.collection(getPath(path, isDebug))
}

exports.firebaseCollectionFromRef = (reference, isDebug) => {
	return db.collection(getPath(reference.path, isDebug))
}

exports.getEndPoint = (endPoint, isDebug) => {
	if (isDebug) {
		return "/DEBUG" + endPoint
	}

	return endPoint
}