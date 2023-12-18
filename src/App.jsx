import React, { useState, useEffect } from 'react'
import axios from 'axios'
import bookLogo from './assets/books.png'
import { Routes, Route, Link, useParams } from 'react-router-dom'
import Navigations from './components/Navigations'
import Books from './components/Books'
import Login from './components/Login'
import Register from './components/Register'
import Account from './components/Account'
import SuccessRegi from './components/SuccessRegi'
import Homepage from './components/Homepage'
import SingleBook from './components/singlebook'

function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState({})
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [books, setBooks] = useState([])

  useEffect(() => {
    const attemptLogin = async () => {
      const loggedInToken = window.localStorage.getItem('token')

      if (loggedInToken) {
        try {
          const response = await axios.get('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${loggedInToken}`
            }
          })

          setUser(response.data)
          setAuthenticated(true)
        } catch (error) {
          console.error('Error fetching user:', error)
        }
      } else {
        throw 'no token'
      }
    };

    attemptLogin()
  }, [token])

  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books')
        setBooks(response.data.books); 
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    };

    fetchBooks()
  }, [])

  return (
    <>
      <h1><img id='logo-image' src={bookLogo} /><Link to='/'>Welcome to the Library</Link></h1>
      <Navigations user={user} />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/books/:id' element={<SingleBook books={books} setBooks={setBooks}/>} />
        <Route path='/successReg' element={<SuccessRegi />} />
        <Route path='/books' element={<Books isAuthenticated={isAuthenticated} />} />
        <Route path='/login' element={<Login setUser={setUser} setToken={setToken} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/account' element={<Account setAuthenticated={setAuthenticated} user={user} setUser={setUser} setToken={setToken} />} />
      </Routes>
    </>
  );
}

export default App
