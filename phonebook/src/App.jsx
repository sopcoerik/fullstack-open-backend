/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import services from "./services/persons"

export const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newPerson, setNewPerson] = useState({
    name: '',
    number: ''
  })
  const [searchInput, setSearchInput] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    services.getAll().then(persons => setPersons(persons))
  }, [])

  const onFormInputChange = (e) => setNewPerson({...newPerson, [e.target.name]: e.target.value})
  const onSearchInputChange = (e) => setSearchInput(e.target.value)
  const saveNewPerson = (person) => setPersons(persons.concat(person))
  
  const resetSuccessMessage = () => setTimeout(() => setSuccessMessage(''), 5000)
  const resetErrorMessage = () => setTimeout(() => setErrorMessage(''), 5000)

  const handleSuccessMessage = (message) => {
    setSuccessMessage(message)
    resetSuccessMessage()
  }

  const handleErrorMessage = (message) => {
    setErrorMessage(message)
    resetErrorMessage()
  }

  const deletePerson = (personId) => {
    services.remove(personId)
    .then(() => {
      const person = persons.find(p => p.id === personId)
      setPersons(persons.filter(pers => pers.id !== personId))
      handleSuccessMessage(`Deleted ${person.name}`)
    })
    .catch(() => {
      handleErrorMessage("Data already removed from server")
    })
  }
  
  const updatePerson = (personId, newPerson) => {
    services.update(personId, newPerson)
    .then(resp => {
      setPersons(persons.map(pers => pers.id !== resp.id ? pers : resp))
      handleSuccessMessage(`Updated number for ${newPerson.name}`)
    })
    .catch(error => {
      handleErrorMessage(error.response.data.error)
    })
  }

  const createPerson = (person) => {
    services.create(person)
    .then(newPerson => {
      saveNewPerson(newPerson)
      handleSuccessMessage(`Added ${newPerson.name}`)
    })
    .catch(err => {
      handleErrorMessage(err.response.data.error)
    })
  }

  const onFormSubmit = (e) => {
    e.preventDefault()

    const presentPerson = persons.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase())

    if(presentPerson) {
      const userConfirm = confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)
      userConfirm && updatePerson(presentPerson.id, newPerson)
    } else {
      createPerson(newPerson)
    }

    setNewPerson({
      name: '',
      number: ''
    })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification errorMessage={errorMessage} successMessage={successMessage}/>
      <Filter searchInput={searchInput} onChange={onSearchInputChange}/>
      <h2>add a new</h2>
      <PersonForm onFormSubmit={onFormSubmit} onFormInputChange={onFormInputChange} newPerson={newPerson}/>
      <h2>Numbers</h2>
      <Persons persons={persons} searchInput={searchInput} deletePerson={deletePerson}/>
    </div>
  )
}

const Filter = ({searchInput, onChange}) => <div>filter shown with: <input value={searchInput} onChange={onChange}/></div>

const PersonForm = ({onFormSubmit, onFormInputChange, newPerson}) => (
  <form onSubmit={onFormSubmit}>
    <div>
      name: <input name="name" onChange={onFormInputChange} value={newPerson.name}/>
    </div>
    <div>
      number: <input name="number" onChange={onFormInputChange} value={newPerson.number}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({persons, searchInput, deletePerson}) => {
  const renderedPersons = persons.filter(person => person.name.toLowerCase().includes(searchInput.toLowerCase())).map(person => <Person key={person.id} person={person} onDelete={() => deletePerson(person.id)}/>)

  return renderedPersons
}

const Person = ({person, onDelete}) => (<p>{person.name} {person.number} <button onClick={() => confirm(`Delete ${person.name}?`) && onDelete()}>delete</button></p>)

const Notification = ({errorMessage, successMessage}) => <h1 className={`${errorMessage && "error"} ${successMessage && "success"}`}>{errorMessage || successMessage || ""}</h1>