import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { getDatabase, ref, remove, set } from 'firebase/database'
import { IQuest } from '../utils/definitions'
import styles from './Markers.module.css'

interface IMarkersProps {
	quests: IQuest[]
	setQuests: React.Dispatch<React.SetStateAction<IQuest[]>>
	setIsDrag: React.Dispatch<React.SetStateAction<boolean>>
}

export function Markers({ quests, setQuests, setIsDrag }: IMarkersProps) {
	const handleDeleteQuest = (id: string) => {
		setQuests(quests => quests.filter(quest => quest.id !== id))
		deleteQuestFromFirebase(id)
	}

	const handleQuestDragEnd = (e: any, id: string) => {
		const newLocation = e.latLng
		setQuests(quests =>
			quests.map(quest =>
				quest.id === id ? { ...quest, location: newLocation } : quest
			)
		)
		updateQuestInFirebase(id, newLocation)
		setTimeout(() => setIsDrag(false), 100)
	}

	const deleteQuestFromFirebase = (id: string) => {
		const database = getDatabase()
		const questRef = ref(database, `quests/${id}`)
		remove(questRef)
	}

	const updateQuestInFirebase = (
		id: string,
		location: google.maps.LatLng | null
	) => {
		const database = getDatabase()
		const questRef = ref(database, `quests/${id}`)

		set(questRef, {
			id,
			location: { lat: location?.lat(), lng: location?.lng() },
			timestamp: Date.now(),
			next: null,
		})
	}

	return (
		<>
			{quests.map((quest, index) => (
				<AdvancedMarker
					key={quest.id}
					position={quest.location}
					draggable={true}
					onDragStart={() => setIsDrag(true)}
					onDragEnd={e => handleQuestDragEnd(e, quest.id)}
				>
					<div className={styles.marker}>
						{index.toString()}
						<button
							onClick={e => {
								e.stopPropagation()
								handleDeleteQuest(quest.id)
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
