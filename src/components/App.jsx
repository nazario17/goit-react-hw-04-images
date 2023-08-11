import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';


const App = () => {

  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [largeImageURL, setLargeImageURL] = useState('')
  
  useEffect(() => { 
    const APIKEY = '38573662-3e20df9f693fcf1720c6655b4';
    const perpage = 12;
    if (
      query && (currentPage === 1 || query !== images.query)
    ) {
      setIsLoading(true);
      fetch(
        `https://pixabay.com/api/?q=${query}&page=${currentPage}&key=${APIKEY}&image_type=photo&orientation=horizontal&per_page=${perpage}`
      )
        .then(response => response.json())
        .then(image => {
          if (!image.total) {
            return alert('Нічого не знайдено');
          }
          setImages(prevImages => [...prevImages, ...image.hits]);
        })
        .catch(error => error)
        .finally(() => {
          setIsLoading(false);
        });
    }
  },[query, currentPage, images.query])

  const handleSearchSubmit = newQuery => {
    if (query === newQuery || !newQuery.length) {
      return alert(`Ви вже увели ${newQuery}`);
    }
    setQuery(newQuery.toLowerCase())
    setImages([])
    setCurrentPage(1)
  };

  const handleItemClick = largeImageURL => {
    setShowModal(true)
    setLargeImageURL(largeImageURL)
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLargeImageURL('');
  };

  const handleLoadMore = () => { 
    setCurrentPage(prevCurrentPage => prevCurrentPage + 1)
  }

    return (
      <div>
        <Searchbar onSubmit={handleSearchSubmit} />
        {isLoading && <Loader />}
        {images.length > 0 && (
          <ImageGallery images={images} onItemClick={handleItemClick} />
        )}
        {images.length > 0 && !isLoading && (
          <Button onClick={handleLoadMore}>Load more</Button>
        )}
        {showModal && (
          <Modal
            largeImageURL={largeImageURL}
            onClose={handleCloseModal}
          />
        )}
      </div>
    );
  }

export default App;
