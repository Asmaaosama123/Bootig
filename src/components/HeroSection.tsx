import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSectionProps {
  heroImages?: string[];
  // للصفحة الرئيسية
  onShopNowClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroImages = [], onShopNowClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ريست الـ index لما تتغير الصور (تغيير كاتيجورى)
  useEffect(() => {
    setCurrentIndex(0);
  }, [heroImages]);

  // Auto-play كل 4 ثوان
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroImages]);

  const goTo = (index: number) => {
    setCurrentIndex((index + heroImages.length) % heroImages.length);
  };

  // لو مفيش صور، بنعرض الـ hero الافتراضي للصفحة الرئيسية
  if (!heroImages.length) {
    if (onShopNowClick) {
      return (
        <div
          className="w-full h-[220px] md:h-[320px] rounded-2xl overflow-hidden relative flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          }}
        >
          <div className="text-center text-white px-6">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Discover Your Style</h1>
            <p className="text-sm md:text-base text-gray-300 mb-5">Explore the latest trends and collections</p>
            <button
              onClick={onShopNowClick}
              className="px-6 py-2.5 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors text-sm"
            >
              Shop Now
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-[150px] md:h-[200px] bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-400 text-sm">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[150px] md:h-[240px] overflow-hidden rounded-2xl group">
      {/* الصور */}
      {heroImages.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Hero ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* أسهم التنقل (تظهر عند hover) */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={() => goTo(currentIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* النقاط في الأسفل */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentIndex
                  ? "bg-white w-5 h-2"
                  : "bg-white/50 w-2 h-2 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
