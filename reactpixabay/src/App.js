import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timeoutId;

    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://pixabay.com/api/?key=35004139-9dd513b8750ba566980f47712&q=${encodeURIComponent(query)}&image_type=photo&per_page=50`
        );

        if (!response.ok) {
          throw new Error('No se pudieron cargar las imágenes. Por favor, inténtalo de nuevo.');
        }

        const data = await response.json();
        setImages(data.hits);
        setError(null);
      } catch (error) {
        setImages([]);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Se espera 500 ms después de la última entrada antes de realizar la búsqueda
    timeoutId = setTimeout(() => {
      if (query.trim() !== '') {
        fetchData();
      } else {
        setImages([]);
        setError(null);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="App">
      <h1>Buscador de Imágenes</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar imágenes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="image-container">
        {images.map((image) => (
          <img key={image.id} src={image.webformatURL} alt={image.tags} />
        ))}
      </div>
    </div>
  );
}

export default App;
