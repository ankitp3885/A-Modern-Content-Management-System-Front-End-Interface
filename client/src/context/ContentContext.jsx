import { createContext, useContext, useEffect, useState } from "react";

const ContentContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ContentProvider({children}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/content`);
            const contents = await response.json();
            setData(contents);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const addContent = async (content) => {
        try {
            const response = await fetch(`${API_BASE_URL}/content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(content),
            });
            const newContent = await response.json();
            setData((prev) => [...prev, newContent]);
        } catch (error) {
            console.error('Error adding content:', error);
        }
    }

    const editContent = async (updatedContent) => {
        try {
            const response = await fetch(`${API_BASE_URL}/content/${updatedContent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedContent),
            });
            const result = await response.json();
            setData((prev) => prev.map((item) => 
                item._id === updatedContent._id ? result : item
            ));
        } catch (error) {
            console.error('Error editing content:', error);
        }
    }

    const deleteContent = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/content/${id}`, {
                method: 'DELETE',
            });
            setData((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            console.error('Error deleting content:', error);
        }
    }

    const addComment = async (contentId, comment) => {
        try {
            const response = await fetch(`${API_BASE_URL}/content/${contentId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(comment),
            });
            const updatedContent = await response.json();
            setData((prev) => prev.map((item) => 
                item._id === contentId ? updatedContent : item
            ));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    const clearAll = async () => {
        try {
            // Note: This would require a clear all endpoint, for now just clear local state
            setData([]);
        } catch (error) {
            console.error('Error clearing content:', error);
        }
    }

    return (
        <ContentContext.Provider value={{data, loading, addContent, editContent, deleteContent, addComment, clearAll}}>
            {children}
        </ContentContext.Provider>
    )
}

export const useContent = () => useContext(ContentContext);

