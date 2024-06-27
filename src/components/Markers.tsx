import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { getDatabase, ref, remove, set } from 'firebase/database'
import { IMarker } from '../utils/definitions'
import styles from './Markers.module.css'

interface IMarkersProps {
	markers: IMarker[]
	setMarkers: React.Dispatch<React.SetStateAction<IMarker[]>>
	setIsDrag: React.Dispatch<React.SetStateAction<boolean>>
}

export function Markers({ markers, setMarkers, setIsDrag }: IMarkersProps) {
	const handleDeleteMarker = (id: string) => {
		setMarkers(markers => markers.filter(marker => marker.id !== id))
		deleteMarkerFromFirebase(id)
	}

	const handleMarkerDragEnd = (e: any, id: string) => {
		const newLocation = e.latLng
		setMarkers(markers =>
			markers.map(marker =>
				marker.id === id ? { ...marker, location: newLocation } : marker
			)
		)
		updateMarkerInFirebase(id, newLocation)
		setTimeout(() => setIsDrag(false), 100)
	}

	const deleteMarkerFromFirebase = (id: string) => {
		const database = getDatabase()
		const markerRef = ref(database, `markers/${id}`)
		remove(markerRef)
	}

	const updateMarkerInFirebase = (
		id: string,
		location: google.maps.LatLng | null
	) => {
		const database = getDatabase()
		const markerRef = ref(database, `markers/${id}`)

		set(markerRef, {
			id,
			location: { lat: location?.lat(), lng: location?.lng() },
		})
	}

	return (
		<>
			{markers.map((marker, index) => (
				<AdvancedMarker
					key={marker.id}
					position={marker.location}
					draggable={true}
					onDragStart={() => setIsDrag(true)}
					onDragEnd={e => handleMarkerDragEnd(e, marker.id)}
				>
					<div className={styles.marker}>
						{index.toString()}
						<button
							onClick={e => {
								e.stopPropagation()
								handleDeleteMarker(marker.id)
							}}
						>
							X
						</button>
					</div>
				</AdvancedMarker>
			))}
		</>
	)
}
