import React from 'react';
import Menu from './Menu';

const Mapa = () => {
    
    return (
    
      <div>
        <Menu />
          <div>
              <p className='text-left h5 m-3' style={{ color: 'purple', fontWeight: 'bold', textAlign: 'center' }}>ACÁ PODÉS ENCONTRARNOS!</p>
          </div>
          <div className="col-md-12 d-flex justify-content-center map-container" style={{ paddingBottom: '150px' }}>
              <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13398.765965138957!2d-68.79896165!3d-32.90632415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e0ea0bc78593d%3A0x61932a53d62932c7!2sMendoza%20Shopping!5e0!3m2!1ses-419!2sar!4v1718318393894!5m2!1ses-419!2sar"
                  width="600"
                  height="450"
                  style={{ border: '0' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className='col-md-12 mb-5'
              ></iframe>
          </div>
      </div>
  );
};
export default Mapa;