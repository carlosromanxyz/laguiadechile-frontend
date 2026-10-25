/** Farmacia de turno (respuesta de `/api/pharmacies`). */
export interface IPharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  lat: number;
  lng: number;
}

/** Cuerpo de `/api/pharmacies`. */
export interface IPharmaciesResponse {
  pharmacies: IPharmacy[];
  count: number;
}
