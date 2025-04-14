/*
* RezerveBot - Otel Rezervasyon Asistanı
* Ana JavaScript Dosyası
*/

// DOM içeriği yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Sayfa yüklenme işlemcisi
    window.addEventListener('load', function() {
        // Loader'ı gizle
        const loaderContainer = document.querySelector('.loader-container');
        if (loaderContainer) {
            loaderContainer.classList.add('hidden');
        }
        
        // AOS Animasyon kütüphanesini başlat
        AOS.init({
            duration: 800,
            offset: 100,
            once: true,
            easing: 'ease-in-out'
        });
        
        // Sayaç animasyonlarını başlat
        initCounters();
    });
    
    // Mobil menü işlemcisi
    const mobileToggle = document.getElementById('mobileToggle');
    const navItems = document.getElementById('navItems');
    const navOverlay = document.getElementById('navOverlay');
    
    if (mobileToggle && navItems && navOverlay) {
        console.log('Mobil menü elementleri bulundu ve etkinleştirildi'); // Debug
        
        // Sayfa yüklendiğinde ve yeniden boyutlandırıldığında menü yüksekliğini ayarla
        function updateMenuHeight() {
            const windowHeight = window.innerHeight;
            
            // Menü yüksekliğini hem CSS değişkeni hem de doğrudan style ile ayarla
            navItems.style.setProperty('--menu-height', `${windowHeight}px`);
            navItems.style.height = `${windowHeight}px`;
            
            // Menünün görünürlüğünü sağlamak için z-index değerini yüksek ayarla
            navItems.style.zIndex = '1000';
            
            // Masaüstü görünümünde menü öğelerini görünür yap
            if (window.innerWidth >= 992) {
                const navLinks = navItems.querySelectorAll('li');
                navLinks.forEach(item => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                });
                
                // Masaüstü görünümünde menü yüksekliğini sıfırla
                navItems.style.height = 'auto';
                
                // Masaüstü görünümünde aktif sınıfları kaldır
                mobileToggle.classList.remove('active');
                navItems.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            } else {
                // Mobil görünümde ve menü kapalıysa öğeleri gizli yap
                if (!navItems.classList.contains('active')) {
                    const navLinks = navItems.querySelectorAll('li');
                    navLinks.forEach(item => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(50px)';
                    });
                } else {
                    // Menü açıksa, yüksekliği tam ayarla
                    navItems.style.height = `${windowHeight}px`;
                    
                    // Overlay'ın da tam yükseklikte olmasını sağla
                    navOverlay.style.height = `${windowHeight}px`;
                }
            }
        }
        
        // Sayfa yüklendiğinde ve yeniden boyutlandırıldığında çalıştır
        window.addEventListener('load', updateMenuHeight);
        window.addEventListener('resize', updateMenuHeight);
        
        // Sayfa başlangıcında menü öğelerini hazırla 
        const navLinks = navItems.querySelectorAll('li');
        
        mobileToggle.addEventListener('click', function() {
            // Toggle active sınıflarını ekle/çıkar
            this.classList.toggle('active');
            navItems.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            
            // Menü açılırken yükseklik ayarlaması yap
            if (navItems.classList.contains('active')) {
                updateMenuHeight();
                
                // Menü öğeleri için gecikme ekle
                navLinks.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 100 + (index * 50));
                });
            } else {
                // Menü kapanırken sıfırla
                navLinks.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(50px)';
                });
            }
        });
        
        // Overlay tıklama ile menüyü kapat
        navOverlay.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            navItems.classList.remove('active');
            this.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // Menü öğelerini sıfırla
            const navLinks = navItems.querySelectorAll('li');
            navLinks.forEach((item) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(50px)';
            });
        });
        
        // Menü linkine tıklayınca mobil menüyü kapat
        navItems.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    mobileToggle.classList.remove('active');
                    navItems.classList.remove('active');
                    navOverlay.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                    
                    // Menü öğelerini sıfırla
                    navLinks.forEach(item => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(50px)';
                    });
                }
            });
        });
    }
    
    // Smooth scroll işlemcisi
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Aktif link'i güncelle
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // Mobil menüyü kapat
            if (window.innerWidth < 992) {
                mobileToggle.classList.remove('active');
                navItems.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
    
    // Sayfa kaydırma işlemcisi
    window.addEventListener('scroll', function() {
        // Header'ı scroll durumuna göre güncelle
        const header = document.querySelector('#header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top düğmesini göster/gizle
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Scroll edildiğinde aktif bölümü belirle
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Back to top düğmesi işlemcisi
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Custom cursor işlemcisi
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.opacity = '1';
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
        
        document.addEventListener('mouseout', function() {
            cursor.style.opacity = '0';
        });
        
        // Hover efekti
        const hoverElements = document.querySelectorAll('a, button, .btn, .feature-card, .process-content, .social-icon');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
                cursor.style.borderColor = 'transparent';
            });
            
            element.addEventListener('mouseleave', function() {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.borderColor = 'var(--primary-color)';
            });
        });
    }
    
    // Sayaç animasyonu
    function initCounters() {
        const statCounts = document.querySelectorAll('.stat-count');
        
        statCounts.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 saniye
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += step;
                
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Sayacı başlat (eğer görünür alandaysa)
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
    
    // Testimonial slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const prevTestimonial = document.querySelector('.prev-testimonial');
    const nextTestimonial = document.querySelector('.next-testimonial');
    
    if (testimonialSlides.length > 0) {
        let currentSlide = 0;
        
        // Slider'ı güncelle
        function updateSlider() {
            testimonialSlides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (testimonialDots[index]) {
                    testimonialDots[index].classList.remove('active');
                }
            });
            
            testimonialSlides[currentSlide].classList.add('active');
            if (testimonialDots[currentSlide]) {
                testimonialDots[currentSlide].classList.add('active');
            }
        }
        
        // Sonraki slide'a geç
        function nextSlide() {
            currentSlide++;
            if (currentSlide >= testimonialSlides.length) {
                currentSlide = 0;
            }
            updateSlider();
        }
        
        // Önceki slide'a geç
        function prevSlide() {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = testimonialSlides.length - 1;
            }
            updateSlider();
        }
        
        // Otomatik slider
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Önceki/sonraki butonları
        if (prevTestimonial && nextTestimonial) {
            prevTestimonial.addEventListener('click', function() {
                prevSlide();
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
            
            nextTestimonial.addEventListener('click', function() {
                nextSlide();
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        
        // Nokta navigasyonu
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlide = index;
                updateSlider();
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }
    
    // WhatsApp Demo için yazma animasyonu
    const typingIndicator = document.querySelector('.typing-indicator');
    
    if (typingIndicator) {
        setTimeout(() => {
            // Typing göstergesini kaldır
            typingIndicator.parentElement.classList.remove('typing');
            
            // Yeni mesaj ekle
            const chatMessages = document.querySelector('.chat-messages');
            const newMessage = document.createElement('div');
            newMessage.className = 'message received';
            newMessage.innerHTML = `
                <p>Tarih aralığı için arama yaptım. 15-18 Haziran için 2 yetişkin kapasiteli odalarımız müsait. Standart, Deluxe ve Suite oda tipleri mevcut. Hangi oda tipi sizin için uygun olur?</p>
                <span class="message-time">14:26</span>
            `;
            
            chatMessages.appendChild(newMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 3000);
    }
    
    // Form gönderme işlemcisi
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(e) {
            // e.preventDefault(); // Artık formu engellemiyoruz, normal HTML form submit işlemi
            
            // Formu göndermeden önce basit doğrulama
            let isValid = true;
            contactForm.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red'; 
                } else {
                    input.style.borderColor = ''; 
                }
            });

            if (!isValid) {
                e.preventDefault(); // Sadece hata durumunda gönderiyi engelle
                formMessage.textContent = 'Lütfen tüm zorunlu alanları doldurun.';
                formMessage.className = 'form-message error';
                return;
            }

            // Formun gönderildiğini belirtmek için düğme metnini değiştir
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Gönderiliyor...';
            
            // Form otomatik olarak huseyinaltikulac4@gmail.com'a gönderilecek
            // Formu JavaScript ile değil, HTML action ile gönderiyoruz
        });
    }
    
    // Video Modal İşlemcisi
    const playVideoButton = document.getElementById('playDemoVideo');
    const videoModal = document.getElementById('videoModal');
    const closeModalButton = document.getElementById('closeModal');
    const youtubeVideo = document.getElementById('youtubeVideo');
    const youtubeVideoSrc = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"; // Örnek video ID

    if (playVideoButton && videoModal && closeModalButton && youtubeVideo) {
        playVideoButton.addEventListener('click', () => {
            youtubeVideo.src = youtubeVideoSrc; // URL'yi modal açılınca ata
            videoModal.classList.add('active');
        });

        closeModalButton.addEventListener('click', () => {
            videoModal.classList.remove('active');
            youtubeVideo.src = ''; // URL'yi temizle (videoyu durdurur)
        });

        // Modal dışına tıklayınca kapat
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) { // Sadece modal arka planına tıklanırsa
                videoModal.classList.remove('active');
                youtubeVideo.src = '';
            }
        });
    }
}); 