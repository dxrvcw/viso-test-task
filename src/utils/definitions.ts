export interface IMarker {
	id: string
	location: google.maps.LatLng
}
export interface IQuest {
	id: string
	location: { lat: number; lng: number }
	timestamp: number
	next: string | null
}
