import React, { useState } from 'react';

const articles = [
  { title: 'Artículo 1', text: 'Texto del artículo 1' },
  { title: 'Artículo 2', text: 'Texto del artículo 2' },
  { title: 'Artículo 3', text: 'Texto del artículo 3' },
  { title: 'Artículo 4', text: 'Texto del artículo 4' },
  { title: 'Artículo 5', text: 'Texto del artículo 5' },
];

const ArticleList = () => {
    return (
      <div>
        <h1>Lista de Artículos</h1>
        {articles.map((article, index) => (
          <Article key={index} title={article.title} text={article.text} />
        ))}
      </div>
    );
  };
  
  const Article = ({ title, text }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    const toggleVisibility = () => {
      setIsVisible(prev => !prev);
    };
  
    return (
      <div style={{ marginBottom: '20px' }}>
        <h2>{title}</h2>
        <button onClick={toggleVisibility}>
          {isVisible ? 'Ocultar' : 'Mostrar'} texto
        </button>
        {isVisible && <p>{text}</p>}
      </div>
    );
  };
  
  export default ArticleList;