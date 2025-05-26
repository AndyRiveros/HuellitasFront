import "../styles/Perros.css";

const Perros = () => {
  return (
    <div className="perros-container">
      <h2 className="perros-title">Todo para tu perro</h2>
      <p className="perros-description">Encuentra los mejores productos para tu compañero de cuatro patas.</p>

      <div className="categorias-container">
        {/* Sección de Alimentos */}
        <div className="categoria">
          <h3>Alimentos</h3>
          <ul>
            <li>Adulto</li>
            <li>Cachorro</li>
            <li>Senior</li>
            <li>Light / Castrados</li>
            <li>Necesidades Especiales</li>
          </ul>
        </div>

        {/* Sección de Snacks */}
        <div className="categoria">
          <h3>Snacks</h3>
          <ul>
            <li>Adulto</li>
            <li>Cachorro</li>
            <li>Ver todos</li>
          </ul>
        </div>

        {/* Sección de Higiene */}
        <div className="categoria">
          <h3>Higiene</h3>
          <ul>
            <li>Cepillos y Cardinas</li>
            <li>Champús y Lociones</li>
            <li>Recolección de Heces</li>
            <li>Repelentes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Perros;
