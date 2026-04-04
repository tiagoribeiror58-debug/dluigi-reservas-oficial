import { Image as ImageIcon } from 'lucide-react';

export default function PhotoGallery() {
  return (
    <section className="section-media">
      <div className="section-header">
        <h2 className="section-title text-center">Galeria de Sabores e Momentos</h2>
        <p className="section-sub text-center">Nossas melhores criações para o seu evento e os detalhes do nosso salão</p>
      </div>
      <div className="photo-grid">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="photo-card">
            {/* Espaço para a foto: Substituir este placeholder pela tag <img> */}
            <div className="photo-placeholder">
              <ImageIcon size={32} className="photo-icon" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
