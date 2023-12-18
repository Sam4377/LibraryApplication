import React from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';

const SingleBook = ({ books, setBooks }) => {
    const { id } = useParams();
    const book = books.find((book) => book.id === parseInt(id));

    const handleCheckout = async () => {
        try {
            const loggedInToken = window.localStorage.getItem('token');
            if (!loggedInToken) {
                throw new Error('No token found');
            }

            
            await axios.patch(
                `https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/${id}`,
                { available: false },
                {
                    headers: {
                        'Authorization': `Bearer ${loggedInToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Optionally update the local books state or handle the response
            const updatedBooks = books.map(b =>
                b.id === parseInt(id) ? { ...b, available: false } : b
            );
            setBooks(updatedBooks);
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <div>
            <h1>{book.title}</h1>
            <img src={book.coverimage} alt={book.title} className="bookimage"/>
            <h2 className="bookdesc">{book.author}</h2>
            <p className="bookdesc">{book.description}</p>
            <button onClick={handleCheckout}>Checkout</button>
            <Link to="/books">
                <button>Back</button>
            </Link>
        </div>
    );
}

export default SingleBook;
