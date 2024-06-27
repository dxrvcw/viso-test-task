import { initializeApp } from 'firebase/app'

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'spry-catcher-416319.firebaseapp.com',
	databaseURL:
		'https://spry-catcher-416319-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'spry-catcher-416319',
	storageBucket: 'spry-catcher-416319.appspot.com',
	messagingSenderId: '234526706158',
	appId: '1:234526706158:web:8a74034a20354a1c6f26ff',
	measurementId: 'G-RYY2P5SHD4',
}

const app = initializeApp(firebaseConfig)

export default app
