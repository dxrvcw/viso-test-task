import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { getDatabase, onValue, ref, remove, set } from 'firebase/database'
import { useEffect, useState } from 'react'
import styles from './App.module.css'
import { Markers } from './components/Markers'
import firebaseCfg from './data/firebase'
import { IQuest } from './utils/definitions'
import { generateID } from './utils/utils'

export function App() {
	const [quests, setQuests] = useState<IQuest[]>([])
	const [isDrag, setIsDrag] = useState(false)

	useEffect(() => {
		const database = getDatabase(firebaseCfg)
		const collectionRef = ref(database, 'quests')

		const fetchData = () => {
			onValue(collectionRef, snapshot => {
				const data = snapshot.val()
				if (data) {
					const loadedQuests = Object.keys(data).map(key => ({
						id: key,
						location: data[key].location,
						timestamp: data[key].timestamp,
						next: data[key].next,
					}))
					setQuests(loadedQuests)
				}
			})
		}

		fetchData()
	}, [])

	const handleAddQuest = (e: { detail: { latLng: any } }) => {
		if (isDrag) {
			setIsDrag(false)
			return
		}
		const newQuest = {
			id: generateID(),
			location: e.detail.latLng,
			timestamp: Date.now(),
			next: null,
		}
		setQuests(prevQuests => [...prevQuests, newQuest])
		addQuestToFirebase(newQuest)
	}

	const handleDeleteAll = () => {
		setQuests([])
		deleteAllQuestsFromFirebase()
	}

	const addQuestToFirebase = (quest: IQuest) => {
		const database = getDatabase(firebaseCfg)
		const questRef = ref(database, `quests/${quest.id}`)
		set(questRef, quest)
	}

	const deleteAllQuestsFromFirebase = () => {
		const database = getDatabase(firebaseCfg)
		const questsRef = ref(database, 'quests')
		remove(questsRef)
	}

	return (
		<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
			<Map
				style={{ width: '100vw', height: '100vh' }}
				defaultCenter={{ lat: 49.850587, lng: 24.039929 }}
				mapId='MAP_ID'
				defaultZoom={13}
				disableDefaultUI={true}
				onClick={handleAddQuest}
			>
				<Markers quests={quests} setQuests={setQuests} setIsDrag={setIsDrag} />
			</Map>
			<button className={styles.deleteButton} onClick={handleDeleteAll}>
				Delete all quests
			</button>
		</APIProvider>
	)
}
