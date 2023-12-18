import { useState, useEffect } from "react"
import axios from 'axios' 
import { Link } from "react-router-dom"

const Books = ({ isAuthenticated }) => {

    const [books, setBooks] = useState([])

    useEffect(() => {
     const fetchBooks = async () => {
        try {
            const response = await axios.get('https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books')
            setBooks(response.data.books)
        } catch (error) {
            console.error('error grabbing books:', error)
        }
     }   
        fetchBooks()
    }, [])


    return(
        <div>

            <h1>Books</h1>
            <ul className="bookcont">
                {
                books.map((book) => (
                <li key={book.id} className="bookitem">
                    <p>Title: {book.title}</p>
                    <p>Author: {book.author}</p>
                    {isAuthenticated ? ( <p>Status: {book.available ? 'Available' : 'Reserved'}</p>) : null}
                    <Link to={`/books/${book.id}`}>Book Details</Link>
                </li>    
                )) }
                
            </ul>
        
        </div>
    )
}

export default Books