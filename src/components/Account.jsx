import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

const Account = ({ user, setUser, setToken, setAuthenticated }) => {
    const navigate = useNavigate();
    const [checkedOutBooks, setCheckedOutBooks] = useState([]);

    const logout = () => {
        window.localStorage.removeItem('token');
        setToken(null);
        setUser({});
        setAuthenticated(false);
        navigate('/');
    };

    useEffect(() => {
        const fetchCheckedOutBooks = async () => {
            try {
                const loggedInToken = window.localStorage.getItem('token');
                if (!loggedInToken) {
                    throw new Error('No token found');
                }

                const response = await axios.get(
                    'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations',
                    {
                        headers: {
                            Authorization: `Bearer ${loggedInToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                    
                setCheckedOutBooks(response.data.BoundFunctionObject || []);
                console.log(setCheckedOutBooks)
            } catch (error) {
                console.error('Error fetching checked out books:', error);
            }
        };

        fetchCheckedOutBooks();
    }, []);

    const handleReturnBook = async (bookId) => {
        try {
            const loggedInToken = window.localStorage.getItem('token');
            if (!loggedInToken) {
                throw new Error('No token found');
            }

            await axios.patch(
                `https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/${bookId}`,
                { available: true },
                {
                    headers: {
                        Authorization: `Bearer ${loggedInToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // After returning the book, refresh the list of checked out books
            const response = await axios.get(
                'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/reservations',
                {
                    headers: {
                        Authorization: `Bearer ${loggedInToken}`
                    }
                }
            );
            setCheckedOutBooks(response.data || []);
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    if (!user.books) {
        return null;
    }

    return (
        <div>
            <h1>Account</h1>
            <button onClick={logout}>Logout</button>
            <hr />
            <h2>Email: {user.email}</h2>
            <h4>Checked Out Books:</h4>
            <ul>
                {
                checkedOutBooks.map((book) => (
                    <li key={book.id}>
                        {book.title} - 
                        <button onClick={() => handleReturnBook(book.id)}>Return</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Account;
