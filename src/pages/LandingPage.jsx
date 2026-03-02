import { useState, useEffect } from 'react';
import NYULogo from '../NYU_logo.png';
import PublicNav from '../components/PublicNav';

const BASE = process.env.REACT_APP_API_URL;

export default function LikeLionNYU() {
  const [currentAdmin, setCurrentAdmin] = useState(0);
  const [flippedCards, setFlippedCards] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [memberPhotoMap, setMemberPhotoMap] = useState({}); // member_id -> photo_url
  const [projectPhotos, setProjectPhotos] = useState([]);
  const [currentProjectPhoto, setCurrentProjectPhoto] = useState(0);

  useEffect(() => {
    const fetchAdminCards = async () => {
      try {
        const res = await fetch(`${BASE}/api/admin-cards`);
        if (!res.ok) return;
        const data = await res.json();
        setAdmins(data.cards ?? []);
      } catch (err) {
        console.error('Failed to load admin cards:', err);
      } finally {
        setAdminsLoading(false);
      }
    };

    const fetchMemberPhotos = async () => {
      try {
        const res = await fetch(`${BASE}/api/retrieve-all-photos`);
        if (!res.ok) return;
        const data = await res.json();
        const map = {};
        const projectUrls = [];
        (data.photos || []).forEach((p) => {
          if (p.source === 'member' && p.member_id && p.photo_url) {
            // 멤버당 첫 번째 사진만 사용
            if (!map[p.member_id]) map[p.member_id] = p.photo_url;
          } else if (p.source === 'project' && p.photo_url) {
            projectUrls.push(p.photo_url);
          }
        });
        setMemberPhotoMap(map);
        setProjectPhotos(projectUrls);
      } catch (err) {
        console.error('Failed to load member photos:', err);
      }
    };

    fetchAdminCards();
    fetchMemberPhotos();
  }, []);

  const nextAdmin = () => {
    setCurrentAdmin((prev) => (prev + 4 >= admins.length ? prev : prev + 4));
  };

  const prevAdmin = () => {
    setCurrentAdmin((prev) => (prev - 4 < 0 ? 0 : prev - 4));
  };

  const nextProjectPhoto = () => {
    setCurrentProjectPhoto((prev) => (prev + 1) % projectPhotos.length);
  };

  const prevProjectPhoto = () => {
    setCurrentProjectPhoto(
      (prev) => (prev - 1 + projectPhotos.length) % projectPhotos.length,
    );
  };

  const handleCardHover = (globalIndex, isHovering) => {
    if (isHovering) {
      setFlippedCards((prev) => [...prev, globalIndex]);
    } else {
      setFlippedCards((prev) => prev.filter((i) => i !== globalIndex));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <PublicNav />

      {/* Hero Section */}
      <section className="text-center py-[60px] md:py-[100px] px-[16px]">
        <h1 className="text-[30px] sm:text-[42px] md:text-[64px] lg:text-[96px] font-bold mb-[40px] md:mb-[60px] flex items-center justify-center leading-tight md:leading-normal whitespace-nowrap">
          LikeLion <span className="mx-[6px] sm:mx-[10px] md:mx-[16px]">x</span>{' '}
          <span className="text-nyu-purple">NYU</span>
          <img
            src={NYULogo}
            alt="NYU Logo"
            className="h-[30px] sm:h-[42px] md:h-[64px] lg:h-[96px] ml-[6px] sm:ml-[10px] md:ml-[16px]"
          />
        </h1>

        <p className="max-w-[800px] mx-auto text-gray-600 leading-relaxed mb-[40px] md:mb-[60px]">
          LikeLion is a student-run tech community founded in South Korea in 2013,
          now spanning 50+ campuses across the United States. At NYU, we bring
          together students of all majors and backgrounds — coders and
          non-coders alike — to learn, build, and grow together. Through study
          groups, hands-on projects, and community events, we help each other
          turn ideas into reality and take the first step into the tech industry.
        </p>

        <a
          href="https://linktr.ee/nyu_likelion?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnS1LXQBhcZAq5tVKjJlspGPGFoiBDd1QY-Ij6_uvyw8y6-_SoadTm2y4tcjI_aem_gcI0U_vmyQWrZxwiatd4Ag"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-[24px] py-[8px] border border-black rounded-full text-[20px] font-normal hover:bg-gray-100 mb-[80px] md:mb-[135px] shadow-button transition-all duration-200 hover:-translate-y-1 hover:shadow-hover"
        >
          Join Us
        </a>
      </section>

      {/* Admin Section */}
      <section className="bg-nyu-purple py-[45px] px-4 md:px-[41px] text-white">
        <h2 className="text-[28px] md:text-[36px] text-center mb-[30px] leading-normal">
          Meet Our Admin
        </h2>

        <div className="max-w-6xl mx-auto flex items-center gap-2 md:gap-4">
          {/* Prev arrow — always inline, never clipped */}
          <button
            onClick={prevAdmin}
            className="shrink-0 text-[28px] md:text-[40px] leading-none hover:scale-110 transition-transform"
          >
            ‹
          </button>

          {/* Card grid — flex-1 so it fills space between arrows */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 lg:gap-[30px] flex-1 min-w-0">
            {adminsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-[20px] md:h-[30px] bg-white bg-opacity-20 rounded-full mb-[8px] md:mb-[12px] animate-pulse" />
                    <div className="aspect-[3/4] bg-white bg-opacity-20 rounded-[20px] animate-pulse" />
                  </div>
                ))
              : admins
                  .slice(currentAdmin, currentAdmin + 4)
                  .map((admin, index) => {
                    const globalIndex = currentAdmin + index;
                    return (
                      <div key={admin.id ?? globalIndex}>
                        <div className="text-center text-[16px] md:text-[18px] lg:text-[22px] font-bold mb-[8px] md:mb-[12px] leading-tight">
                          {admin.position}
                        </div>
                        <div
                          onMouseEnter={() => handleCardHover(globalIndex, true)}
                          onMouseLeave={() => handleCardHover(globalIndex, false)}
                          className="relative cursor-pointer aspect-[3/4]"
                          style={{ perspective: '1000px' }}
                        >
                          <div
                            className="absolute inset-0 transition-transform duration-1000"
                            style={{
                              transformStyle: 'preserve-3d',
                              transform: flippedCards.includes(globalIndex)
                                ? 'rotateY(180deg)'
                                : 'rotateY(0deg)',
                            }}
                          >
                            {/* Front Side */}
                            <div
                              className="absolute w-full h-full bg-white rounded-[16px] md:rounded-[20px] p-[8px] md:p-[12px] text-center shadow-card flex flex-col"
                              style={{ backfaceVisibility: 'hidden' }}
                            >
                              {admin.member_id && memberPhotoMap[admin.member_id] ? (
                                <img
                                  src={memberPhotoMap[admin.member_id]}
                                  alt={admin.display_name}
                                  className="rounded-[12px] md:rounded-[16px] flex-1 min-h-0 mb-[6px] md:mb-[10px] object-cover w-full"
                                />
                              ) : (
                                <div className="bg-gray-300 rounded-[12px] md:rounded-[16px] flex-1 min-h-0 mb-[6px] md:mb-[10px]" />
                              )}
                              <div className="text-black font-bold text-[13px] md:text-[14px] leading-tight shrink-0">
                                {admin.display_name}
                              </div>
                            </div>

                            {/* Back Side */}
                            <div
                              className="absolute w-full h-full bg-white rounded-[16px] md:rounded-[20px] p-[10px] md:p-[15px] text-center shadow-card flex flex-col justify-center items-center"
                              style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                              }}
                            >
                              <div className="text-black font-bold text-[14px] md:text-[18px] mb-[8px] md:mb-[14px] leading-tight">
                                {admin.display_name}
                              </div>
                              <div className="text-gray-700 text-[11px] md:text-[13px] leading-relaxed px-[4px] md:px-[10px]">
                                {admin.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
          </div>

          {/* Next arrow — always inline, never clipped */}
          <button
            onClick={nextAdmin}
            className="shrink-0 text-[28px] md:text-[40px] leading-none hover:scale-110 transition-transform"
          >
            ›
          </button>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-[60px] md:py-[100px] px-[16px] bg-white">
        <h2 className="text-[28px] md:text-[36px] font-bold text-center mb-[40px] md:mb-[60px]">
          Our Projects
        </h2>

        {projectPhotos.length > 0 ? (
          <div className="max-w-2xl mx-auto">
            {/* Photo + arrows row */}
            <div className="flex items-center gap-3 md:gap-6">
              <button
                onClick={prevProjectPhoto}
                className="shrink-0 text-[36px] md:text-[48px] leading-none hover:scale-110 transition-transform text-gray-400 hover:text-black"
              >
                ‹
              </button>

              <div className="flex-1 rounded-[16px] md:rounded-[24px] overflow-hidden shadow-card aspect-square bg-gray-100">
                <img
                  key={currentProjectPhoto}
                  src={projectPhotos[currentProjectPhoto]}
                  alt={`Project photo ${currentProjectPhoto + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={nextProjectPhoto}
                className="shrink-0 text-[36px] md:text-[48px] leading-none hover:scale-110 transition-transform text-gray-400 hover:text-black"
              >
                ›
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-[8px] mt-[20px]">
              {projectPhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentProjectPhoto(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === currentProjectPhoto
                      ? 'w-[20px] h-[8px] bg-black'
                      : 'w-[8px] h-[8px] bg-gray-300 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <p className="text-center text-gray-400 text-sm mt-[10px]">
              {currentProjectPhoto + 1} / {projectPhotos.length}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-400">No project photos yet.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <a
          href="https://instagram.com/nyu_likelion"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 hover:text-opacity-70 transition-opacity"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
