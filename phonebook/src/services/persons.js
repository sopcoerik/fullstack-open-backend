import axios from "axios";

const BASE_URL = '/api/persons'

const getAll = () => axios.get(BASE_URL).then(response => response.data)

const create = (person) => axios.post(BASE_URL, person).then(response => response.data)

const update = (personId, newPerson) => axios.put(BASE_URL + `/${personId}`, newPerson).then(response => response.data)

const remove = (personId) => axios.delete(BASE_URL + `/${personId}`)

export default {
    getAll,
    create,
    update,
    remove
}