import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { getDatabase, onValue, ref, remove, set } from 'firebase/database'
import { useEffect, useState } from 'react'
import styles from './App.module.css'
import { Markers } from './components/Markers'
import firebaseCfg from './data/firebase'
import { IMarker } from './utils/definitions'
import { generateID } from './utils/utils'

export function App() {
	const [markers, setMarkers] = useState<IMarker[]>([])
	const [isDrag, setIsDrag] = useState(false)

	useEffect(() => {
		const database = getDatabase(firebaseCfg)
		const collectionRef = ref(database, 'markers')

		const fetchData = () => {
			onValue(collectionRef, snapshot => {
				const data = snapshot.val()
				if (data) {
					const loadedMarkers = Object.keys(data).map(key => ({
						id: key,
						location: data[key].location,
					}))
					setMarkers(loadedMarkers)
				}
			})
		}

		fetchData()
	}, [])

	const handleAddMarker = (e: { detail: { latLng: any } }) => {
		if (isDrag) {
			setIsDrag(false)
			return
		}
		const newMarker = { id: generateID(), location: e.detail.latLng }
		setMarkers(prevMarkers => [...prevMarkers, newMarker])
		addMarkerToFirebase(newMarker)
	}

	const handleDeleteAll = () => {
		setMarkers([])
		deleteAllMarkersFromFirebase()
	}

	const addMarkerToFirebase = (marker: IMarker) => {
		const database = getDatabase(firebaseCfg)
		const markerRef = ref(database, `markers/${marker.id}`)
		set(markerRef, marker)
	}

	const deleteAllMarkersFromFirebase = () => {
		const database = getDatabase(firebaseCfg)
		const markersRef = ref(database, 'markers')
		remove(markersRef)
	}

	return (
		<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
			<Map
				style={{ width: '100vw', height: '100vh' }}
				defaultCenter={{ lat: 49.850587, lng: 24.039929 }}
				mapId='MAP_ID'
				defaultZoom={13}
				disableDefaultUI={true}
				onClick={handleAddMarker}
			>
				<Markers
					markers={markers}
					setMarkers={setMarkers}
					setIsDrag={setIsDrag}
				/>
			</Map>
			<button className={styles.deleteButton} onClick={handleDeleteAll}>
				Delete all markers
			</button>
		</APIProvider>
	)
}
